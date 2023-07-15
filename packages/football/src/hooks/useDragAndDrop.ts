import {
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useCallback, useState } from 'react';

interface OnMoveParams<T> {
  activeObject: T;
  targetObject: T;
  oldIndex: number;
  newIndex: number;
}

export default function useDragAndDrop<T extends { id: string }>(
  onMove: (p: OnMoveParams<T>) => void
) {
  const [items, setItems] = useState<T[]>([]);
  const [activeId, setActiveId] = useState<T | undefined>();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  );

  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;

      setActiveId(items.find(dc => dc.id === active.id));
    },
    [items]
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setItems(curItems => {
          const activeObject = curItems.find(dc => dc.id === active.id)!;
          const targetObject = curItems.find(dc => dc.id === over.id)!;
          const oldIndex = curItems.indexOf(activeObject);
          const newIndex = curItems.indexOf(targetObject);

          // execute in next loop to prevent clashes
          setTimeout(
            () => onMove({ activeObject, targetObject, oldIndex, newIndex }),
            0
          );
          return arrayMove(curItems, oldIndex, newIndex);
        });
      }

      setActiveId(undefined);
    },
    [onMove]
  );

  return {
    sortableContextProps: {
      items,
      strategy: verticalListSortingStrategy,
    },
    dndContextProps: {
      onDragEnd,
      onDragStart,
      sensors,
      collisionDetection: closestCenter,
    },
    activeId,
    items,
    setItems,
  };
}
