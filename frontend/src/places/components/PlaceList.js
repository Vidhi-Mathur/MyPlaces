import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import './PlaceList.css';

const PlaceList = ({items, onDeletePlace}) => {
    if(items.length === 0){
        return (
            <div className="place-list center">
                <Card>
                    <h2>No Places Found. Maybe Create One?</h2>
                    <Button to='/places/new'>Add Place</Button>
                </Card>
            </div>
        )
    }
    return (
        <ul className="place-list">
            {items.map(({id, creator, image, title, description, address, location}) => (
            <PlaceItem key={id} id={id} creator={creator} image={image} title={title} description={description} address={address} coordinates={location} onDelete = {onDeletePlace} />
            ))}
        </ul>
    )
}

export default PlaceList