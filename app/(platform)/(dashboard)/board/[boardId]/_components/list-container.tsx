"use client";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { ListwithCards } from "@/types";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";
import React from "react";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
  data: ListwithCards[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List reordered");
    },
    onError: () => {
      toast.error("Failed to reorder list");
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card reordered");
    },
    onError: () => {
      toast.error("Failed to reorder card");
    },
  });
  const [orderData, setOrderData] = useState(data);

  useEffect(() => {
    setOrderData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { source, destination, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "list") {
      const items = reorder(orderData, source.index, destination.index).map(
        (item, index) => ({
          ...item,
          order: index,
        })
      );

      setOrderData(items);
      executeUpdateListOrder({ items, boardId });
    }

    if (type === "card") {
      const newOrderedData = [...orderData];

      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );

      const destinationList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destinationList) {
        return;
      }

      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      if (!destinationList.cards) {
        destinationList.cards = [];
      }

      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reorderedCards;

        setOrderData(newOrderedData);

        executeUpdateCardOrder({
          boardId: boardId,
          items: reorderedCards,
        });
        //Trigger server action
      } else {
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        movedCard.listId = destination.droppableId;

        destinationList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        destinationList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderData(newOrderedData);

        executeUpdateCardOrder({
          boardId: boardId,
          items: destinationList.cards,
        });
        //Trigger server action
      }
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="lists" type="list" direction={"horizontal"}>
          {(provided) => (
            <ol
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex gap-x-3 h-full"
              id="board"
            >
              {orderData.map((list, index) => (
                <ListItem key={list.id} list={list} index={index} />
              ))}
              {provided.placeholder}
              <ListForm />
              <div className=" flex-shrink-0 w-1" />
            </ol>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
