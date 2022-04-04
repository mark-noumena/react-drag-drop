// @flow
import React, { useCallback } from "react";
import { DraggableProvided, SnapDragActions } from "react-beautiful-dnd";
import styled from "styled-components";

type Props = {
  quote: any;
  isDragging: boolean;
  provided: DraggableProvided;
  isClone?: boolean;
  isGroupedOver?: boolean;
  style?: Object;
  index?: number;
  lift?: (quoteId: string) => SnapDragActions | null;
};

const getBackgroundColor = (
  isDragging: boolean,
  isGroupedOver: boolean,
  authorColors: any
) => {
  if (isDragging) {
    return "white";
  }

  if (isGroupedOver) {
    return "blue";
  }

  return "grey";
};

const getBorderColor = (isDragging: boolean, authorColors: any) =>
  isDragging ? "red" : "transparent";

const imageSize: number = 40;

const CloneBadge = styled.div`
  background: black;
  bottom: ${8 / 2}px;
  border: 2px solid black;
  border-radius: 50%;
  box-sizing: border-box;
  font-size: 10px;
  position: absolute;
  right: -${imageSize / 3}px;
  top: -${imageSize / 3}px;
  transform: rotate(40deg);

  height: ${imageSize}px;
  width: ${imageSize}px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.a<any>`
  border-radius: 2px;
  border: 2px solid transparent;
  border-color: ${(props) => getBorderColor(props.isDragging, props.colors)};
  background-color: ${(props) =>
    getBackgroundColor(props.isDragging, props.isGroupedOver, props.colors)};
  box-shadow: ${({ isDragging }) =>
    isDragging ? `2px 2px 1px black` : "none"};
  box-sizing: border-box;
  padding: 8px;
  min-height: ${imageSize}px;
  margin-bottom: 8px;
  user-select: none;

  /* anchor overrides */
  color: black;

  &:hover,
  &:active {
    color: black;
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: "blue";
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

const Avatar = styled.img`
  width: ${imageSize}px;
  height: ${imageSize}px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
  flex-grow: 0;
`;

const Content = styled.div`
  /* flex child */
  flex-grow: 1;

  /*
    Needed to wrap text in ie11
    https://stackoverflow.com/questions/35111090/why-ie11-doesnt-wrap-the-text-in-flexbox
  */
  flex-basis: 100%;

  /* flex parent */
  display: flex;
  flex-direction: column;
`;

const BlockQuote = styled.div`
  &::before {
    content: open-quote;
  }

  &::after {
    content: close-quote;
  }
`;

const Footer = styled.div`
  display: flex;
  margin-top: 8px;
  align-items: center;
`;

const Author = styled.small<any>`
  flex-grow: 0;
  margin: 0;
  border-radius: 2px;
  font-weight: normal;
  padding: ${8 / 2}px;
`;

const QuoteId = styled.small`
  flex-grow: 1;
  flex-shrink: 1;
  margin: 0;
  font-weight: normal;
  text-overflow: ellipsis;
  text-align: right;
`;

function getStyle(provided: DraggableProvided, style?: Object) {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style,
  };
}

function delay(fn: Function, time: number = 300) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      fn();
      resolve();
    }, time);
  });
}

// Previously this extended React.Component
// That was a good thing, because using React.PureComponent can hide
// issues with the selectors. However, moving it over does can considerable
// performance improvements when reordering big lists (400ms => 200ms)
// Need to be super sure we are not relying on PureComponent here for
// things we should be doing in the selector as we do not know if consumers
// will be using PureComponent
const QuoteItem = (props: Props) => {
  const {
    quote,
    isDragging,
    isGroupedOver,
    provided,
    style,
    index,
    lift,
  } = props;

  const move = useCallback(
    async (type: "up" | "down") => {
      if (!lift) return;

      const actions = lift(quote.id);

      if (!actions) return;

      const { moveDown, moveUp, drop } = actions;

      if (type === "up") {
        await delay(moveUp);
      }
      if (type === "down") {
        await delay(moveDown);
      }
      await delay(drop);
    },
    [lift, quote]
  );

  return (
    <Container
      isDragging={isDragging}
      isGroupedOver={isGroupedOver}
      colors={quote.author.colors}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getStyle(provided, style)}
      data-is-dragging={isDragging}
      data-testid={quote.id}
      data-index={index}
      aria-label={`${quote.author.name} quote ${quote.content}`}
    >
      <Avatar src={quote.author.avatarUrl} alt={quote.author.name} />
      <Content>
        <div>
          <button onClick={() => move("up")}>up</button>
          <button onClick={() => move("down")}>down</button>
        </div>
        <BlockQuote>{quote.content}</BlockQuote>
        <Footer>
          <Author colors={quote.author.colors}>{quote.author.name}</Author>
          <QuoteId>id:{quote.id}</QuoteId>
        </Footer>
      </Content>
    </Container>
  );
};

export default React.memo<Props>(QuoteItem);
