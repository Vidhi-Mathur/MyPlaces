import { useState, useContext } from 'react'
import Card from '../../shared/components/UIElements/Card'
import Button from '../../shared/components/FormElements/Button'
import Modal from '../../shared/components/UIElements/Modal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'
import './PlaceItem.css'

const PlaceItem = ({id, onDelete, address, coordinates, creator, image, title, description}) => {
    const auth = useContext(AuthContext)
    const {isLoading, error, sendRequest, clearError} = useHttpClient()
    const [showMap, setShowMap] = useState(false)
    const [showDelete, setShowDelete] = useState(false)

    const openMapHandler = () => {
        setShowMap(true)
    }

    const closeMapHandler = () => {
        setShowMap(false)
    }

    const openDeleteHandler = () => {
        setShowDelete(true)
    }

    const openCancelHandler = () => {
        setShowDelete(false)
    }

    const confirmDeleteHandler = async() => {
        setShowDelete(false)
        try{
            await sendRequest(`${process.env.REACT_APP_URL}/places/${id}`, 'DELETE', null,{
                Authorization: 'Bearer ' + auth.token
            })
            onDelete(id)
        } 
        catch(err) {
            console.log(err.message)
        }
    }

    return (
    <>
        <ErrorModal error={error} onClear={clearError}/>
        {isLoading && <div className='center'><LoadingSpinner /></div>}
        <Modal show={showMap} onCancel={closeMapHandler} header={address}contentClass="place-item__modal-content"footerClass="place-item__modal-actions" footer={<Button onClick={closeMapHandler}>CLOSE</Button>}>
            <div className="map-container" style={{ padding: "5px" }}>
                <iframe title="map" width="100%"height="100%" src={'https://maps.google.com/maps?q=' + coordinates.lat.toString() + ',' + coordinates.long.toString() + '&t=&z=15&ie=UTF8&iwloc=&output=embed'} />
                <script type='text/javascript' src={`https://embedmaps.com/google-maps-authorization/script.js?id=${process.env.REACT_APP_MAP_ID}`} />
            </div>
        </Modal>
        <Modal show={showDelete} onCancel={openCancelHandler} header="Are You Sure?" footerClass="place-item__modal-actions" footer={
        <>
            <Button inverse onClick={openCancelHandler}>CANCEL</Button>
            <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
        </>
        }>
        <p>Do you want to proceed and delete this place? Please note that it can't be done thereafter.</p>
        </Modal>
        <li className="place-item">
            <Card className="place-item__content">
                {isLoading && <LoadingSpinner asOverlay/>}
                <div className="place-item__image">
                    <img src={`${image}`} alt={title} />
                </div>
                <div className="place-item__info">
                    <h3>{title}</h3>
                    <h3>{address}</h3>
                    <p>{description}</p>
                </div>
                <div className="place-item__actions">
                    <Button inverse onClick={openMapHandler}>View On Map</Button>
                    {auth.userId === creator && (<Button to={`/places/${id}`}>Edit</Button>)}
                    {auth.userId === creator && (<Button danger onClick={openDeleteHandler}>Delete</Button>)}
                </div>
            </Card>
        </li>
    </>
    )
}

export default PlaceItem