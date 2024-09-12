import{ useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/form-hook";
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from "../../shared/context/auth-context";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import './PlaceForm.css'

const UpdatePlace = () => {
const placeId = useParams().placeId
const [loadedPlace, setLoadedPlace] = useState()
const {isLoading, error, sendRequest, clearError} = useHttpClient()
const auth = useContext(AuthContext);
const navigate = useNavigate()
const [formState, inputHandler, setFormData] = useForm({
    title: {
        value: '',
        isValid: false
    },
    description: {
        value: '',
        isValid: false
    }
}, false)

useEffect(() => {
    const fetchPlace = async() => {
        try{
            const responseData = await sendRequest(`${process.env.REACT_APP_URL}/places/${placeId}`)
            setLoadedPlace(responseData.place)
            setFormData({
                title: {
                    value: responseData.place.title,
                    isValid: true
                },
                description: {
                    value: responseData.place.description,
                    isValid: true
                }
            }, true)
        }
        catch(err){
            console.log(err)
        }
    } 
    fetchPlace()
}, [sendRequest, placeId, setFormData])


const updatePlaceHandler = async(e) => {
    e.preventDefault()
    try {
        await sendRequest(`${process.env.REACT_APP_URL}/places/${placeId}`, 'PATCH', JSON.stringify({
            title: formState.inputs.title.value,
            description: formState.inputs.description.value,
        }), {
        Authorization: 'Bearer ' + auth.token,
        'Content-Type': 'application/json'
        })
        navigate('/' + auth.userId + '/places');
    }
    catch(err) {
        console.log(err)
    }
}

if(isLoading){
    return <div className="center"><LoadingSpinner /></div>
}

if(!loadedPlace && !error){
    return <div className="center"><Card><h2>No Place Found</h2></Card></div>
}

return (
    <>
     <ErrorModal error={error} onClear={clearError} />
     {!isLoading && loadedPlace && <form className="place-form" onSubmit={updatePlaceHandler}>
        <Input id="title"element="input" type="text" label="Title" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid text" onInput={inputHandler}initialValue={loadedPlace.title}initialValid={true} />
        <Input id="description"element="textarea" label="Description" validators={[VALIDATOR_MINLENGTH(5)]} errorText="Please enter a valid description with atleast 5 characters" onInput={inputHandler}initialValue={loadedPlace.description}initialValid={true} />
        <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
    </form>}
    </>
    )
}

export default UpdatePlace


