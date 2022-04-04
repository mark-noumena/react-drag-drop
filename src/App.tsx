import React, { useCallback, useRef, useState } from "react";
import {
  DragActions,
  DragDropContext,
  DropResult,
  PreDragActions,
  SensorAPI,
  SnapDragActions,
} from "react-beautiful-dnd";
import QuoteList from "./quote-list";

export const data: any[] = [
  {
    id: "1",
    content: "Sometimes life is scary and dark",
    author: "BMO",
  },
  {
    id: "2",
    content:
      "Sucking at something is the first step towards being sorta good at something.",
    author: "jake",
  },
  {
    id: "3",
    content: "You got to focus on what's real, man",
    author: "jake",
  },
  {
    id: "4",
    content: "Is that where creativity comes from? From sad biz?",
    author: "finn",
  },
  {
    id: "5",
    content: "Homies help homies. Always",
    author: "finn",
  },
  {
    id: "6",
    content: "Responsibility demands sacrifice",
    author: "princess",
  },
  {
    id: "7",
    content: "That's it! The answer was so simple, I was too smart to see it!",
    author: "princess",
  },
  {
    id: "8",
    content:
      "People make mistakes. It's all a part of growing up and you never really stop growing",
    author: "finn",
  },
  {
    id: "9",
    content: "Don't you always call sweatpants 'give up on life pants,' Jake?",
    author: "finn",
  },
  {
    id: "10",
    content: "I should not have drunk that much tea!",
    author: "princess",
  },
  {
    id: "11",
    content: "Please! I need the real you!",
    author: "princess",
  },
  {
    id: "12",
    content: "Haven't slept for a solid 83 hours, but, yeah, I'm good.",
    author: "princess",
  },
];

const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const App: React.FC = () => {
  const [quotes, setQuotes] = useState(data);

  const [isDragging, setIsDragging] = useState(false);
  const [isControlDragging, setIsControlDragging] = useState(false);
  const sensorAPIRef = useRef<SensorAPI | null>(null);

  const useSensor = (api: SensorAPI) => {
    sensorAPIRef.current = api;
  };

  const lift = useCallback(
    (quoteId: string): SnapDragActions | null => {
      if (isDragging) {
        return null;
      }

      const api = sensorAPIRef.current;
      if (!api) {
        console.warn("unable to find sensor api");
        return null;
      }

      const preDrag: PreDragActions | null = api.tryGetLock(quoteId, () => {});

      if (!preDrag) {
        console.log("unable to start capturing");
        return null;
      }

      setIsControlDragging(true);
      return preDrag.snapLift();
    },
    [isDragging]
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      setIsDragging(false);
      setIsControlDragging(false);

      // dropped outside the list
      if (!result.destination) {
        return;
      }

      if (result.destination.index === result.source.index) {
        return;
      }

      const newQuotes = reorder(
        quotes,
        result.source.index,
        result.destination.index
      );

      setQuotes(newQuotes);
    },
    [quotes]
  );

  return (
    <div className="App">
      <DragDropContext
        onDragStart={() => setIsDragging(true)}
        onDragEnd={onDragEnd}
        sensors={[useSensor]}
      >
        <QuoteList listId="list" quotes={quotes} lift={lift} />
      </DragDropContext>
    </div>
  );
};

export default App;
