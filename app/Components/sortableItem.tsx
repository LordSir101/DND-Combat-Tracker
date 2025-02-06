import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { InventoryItem } from '../inventoryItem';

type SortableItemProps = {
    data: InventoryItem
}

export function SortableItem(props: SortableItemProps) {
const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
} = useSortable({id: props.data.id});

const style = {
    transform: CSS.Transform.toString(transform),
    transition,
};
return (
    <li className="" ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {props.data.name}
        <input  className="z-50 mx-4 border-2 border-black" defaultValue="1" type="number" step="1" />
    </li>
)

}