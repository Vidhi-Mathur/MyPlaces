import { useEffect, useState } from 'react';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useParams, useNavigate } from 'react-router-dom'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import PlaceList from '../components/PlaceList';
import { useHttpClient } from '../../shared/hooks/http-hook'

const UserPlaces = () => {
        const [loadedPlaces, setLoadedPlaces] = useState()
        const { isLoading, error, sendRequest, clearError } = useHttpClient()
        const navigate = useNavigate()
        const userId = useParams().userId
        useEffect(() => {
            const fetchPlaces = async() => {
                try{
                    const responseData = await sendRequest(`${process.env.REACT_APP_URL}/places/user/${userId}`)
                    setLoadedPlaces(responseData.places)
                }
                catch(err){
                    console.log(err)
                }
            }
            fetchPlaces()
        }, [sendRequest, userId])

        const placeDeleteHandler = placeId => {
            setLoadedPlaces(places => places.filter(p => p.id !== placeId))
            navigate(`/${userId}/places`);
        }

        return (
            <>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && <div className='center'><LoadingSpinner /></div>}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler}/>}
            </>
        )
    }

export {UserPlaces}