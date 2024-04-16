"use client";

export const FormTextArea = () => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor="description"
        className="text-sm font-medium text-gray-700"
      >
        Description
      </label>
      <textarea
        id="description"
        name="description"
        rows={3}
        className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
      ></textarea>
    </div>
  );
};
