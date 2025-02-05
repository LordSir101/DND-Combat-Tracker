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
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {props.data.name}
        <input defaultValue="1" type="number" name="points" step="1" max="20" min="0" />
    </li>
)

}