// @flow
import React, { useCallback, useRef } from "react";
import { Droppable, Draggable, SnapDragActions } from "react-beautiful-dnd";
import QuoteItem from "./quote-item";
import type {
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import styled from "styled-components";

export const getBackgroundColor = (
  isDraggingOver: boolean,
  isDraggingFrom: boolean
): string => {
  if (isDraggingOver) {
    return "black";
  }
  if (isDraggingFrom) {
    return "black";
  }
  return "black";
};

const Wrapper = styled.div<any>`
  background-color: ${(props) =>
    getBackgroundColor(props.isDraggingOver, props.isDraggingFrom)};
  display: flex;
  flex-direction: column;
  opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : "inherit")};
  padding: 8px;
  border: 8px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  width: 250px;
`;

const scrollContainerHeight: number = 250;

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-height: ${scrollContainerHeight}px;

  /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
  padding-bottom: 8px;
`;

const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: ${scrollContainerHeight}px;
`;

/* stylelint-disable block-no-empty */
const Container = styled.div``;
/* stylelint-enable */

const Wedge = styled.div`
  width: 100%;
  height: 20px;
  background-color: red;
`;

type Props = {
  listId?: string;
  listType?: string;
  quotes: any[];
  title?: string;
  internalScroll?: boolean;
  scrollContainerStyle?: Object;
  isDropDisabled?: boolean;
  isCombineEnabled?: boolean;
  style?: Object;
  // may not be provided - and might be null
  ignoreContainerClipping?: boolean;

  useClone?: boolean;

  lift?: (quoteId: string) => SnapDragActions | null;
};

type QuoteListProps = {
  quotes: any[];
  lift?: (quoteId: string) => SnapDragActions | null;
};

const InnerQuoteList = (props: QuoteListProps): React.ReactElement[] => {
  const { quotes, lift } = props;

  return quotes.map((quote: any, index: number) => (
    <>
      <Draggable
        key={quote.id}
        draggableId={quote.id}
        index={index}
        disableInteractiveElementBlocking
      >
        {(
          dragProvided: DraggableProvided,
          dragSnapshot: DraggableStateSnapshot
        ) => (
          <QuoteItem
            key={quote.id}
            quote={quote}
            isDragging={dragSnapshot.isDragging}
            isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
            provided={dragProvided}
            lift={lift}
          />
        )}
      </Draggable>
      {/* <Wedge>XXX XXX XXX</Wedge> */}
    </>
  ));
};

type InnerListProps = {
  dropProvided: DroppableProvided;
  quotes: any[];
  title?: string;
  lift?: (quoteId: string) => SnapDragActions | null;
};

function InnerList(props: InnerListProps) {
  const { quotes, dropProvided, lift } = props;

  return (
    <Container>
      <DropZone ref={dropProvided.innerRef}>
        {InnerQuoteList({ quotes, lift })}
        {dropProvided.placeholder}
      </DropZone>
    </Container>
  );
}

export default function QuoteList(props: Props) {
  const { listId = "LIST", quotes, lift } = props;

  return (
    <>
      <Droppable droppableId={listId}>
        {(
          dropProvided: DroppableProvided,
          dropSnapshot: DroppableStateSnapshot
        ) => (
          <Wrapper
            isDraggingOver={dropSnapshot.isDraggingOver}
            isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
            {...dropProvided.droppableProps}
          >
            <InnerList
              quotes={quotes}
              dropProvided={dropProvided}
              lift={lift}
            />
          </Wrapper>
        )}
      </Droppable>
    </>
  );
}
