import { Card, List } from "@prisma/client";

export type ListwithCards = List & { cards: Card[] };

export type CardwithList = Card & { list: List };
