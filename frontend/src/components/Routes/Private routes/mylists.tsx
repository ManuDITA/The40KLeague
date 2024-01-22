import { Auth } from "aws-amplify";
import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { CognitoUserContext, isUserAuthenticatedContext } from "../../../App";
import { BsThreeDotsVertical } from "react-icons/bs";

import { Lists } from '../../../../../classes/Lists.tsx'

import { useFormik } from 'formik';
import * as Yup from 'yup';
import apiPaths from "../../../../../apiList/index.js";

import { factions } from "../../../../../classes/Constants.tsx";


const validationSchema = Yup.object().shape({
    list_description: Yup.string().required('List Description is required'),
    list_army: Yup.string().oneOf(factions, 'Invalid faction option').required('List Army is required'),
    list_name: Yup.string().required('List Name is required'),
    is_public: Yup.number().required('Is public is required'),
    list_points: Yup.number().required('List Points is required')
});

const MyLists = (props) => {

    const [receivedLists, setLists] = useState([])

    const { cognitoUser, setCognitoUser } = useContext(CognitoUserContext)
    const { isUserAuthenticated, setIsUserAuthenticated } = useContext(isUserAuthenticatedContext)

    const [isUserCreatingNewList, setIsUserCreatingNewList] = useState(false)

    async function getUserInfo() {
        setCognitoUser(await Auth.currentUserPoolUser());

        const session = await Auth.currentSession();
        const receivedToken = session.getIdToken().getJwtToken();

    }

    const formik = useFormik<Lists>({
        initialValues: {
            player_id: 0,
            list_id: 0,
            list_description: '',
            list_army: '',
            list_name: '',
            is_archived: 0,
            is_public: 0,
            list_points: 0,
            last_update: 0,
            creation_date: '',
            picture_path: '',
        },
        validationSchema,
        onSubmit: (values) => {
            // Handle form submission here
            values.player_id = cognitoUser.username
            createList(values as Lists)
            console.log(values);
        },
    });

    useEffect(() => {
        if (cognitoUser != undefined) {
            console.log('Logged user: ', cognitoUser)
            //getUserEnrolledTournaments()
            getUserLists()
        }
    }, [cognitoUser])


    useEffect(() => {
        console.log('is user authenticated: ', isUserAuthenticated)
        if(isUserAuthenticated == true){
            getUserLists()
            getUserInfo()
        }
    }, [isUserAuthenticated])


    function getUserLists() {
        console.log('fetching lists')
        fetch(apiPaths.playersAPIEndpoint + apiPaths.player + "/" + 'danks' + '/lists', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cognitoUser.signInUserSession.idToken.jwtToken
            }
        }).then((res) => (res.json()))
            .then((output) => {
                console.log("Output: ", output)
                setLists(output)
            })

    }

    function createList(val: Lists) {
        console.log('Creating list')
        console.log(val)
        fetch('https://wwhlvoay4l.execute-api.eu-west-3.amazonaws.com/dev/player/' + cognitoUser.username + '/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cognitoUser.signInUserSession.idToken.jwtToken
            },
            body: JSON.stringify(val)

        }).then((res) => (res.json()))
            .then((output) => {
                console.log("Output: ", output)
            })
    }


    return (
        <div className="pt-24 mx-10 text-black">
            <div className='text-4xl pb-4 text-black'>
                My army lists
            </div>
            <button className="text-xl bg-blue-300 p-3 rounded-md border-blue-600 border-2 text-black" onClick={() => setIsUserCreatingNewList(true)}>Create new list</button>
            <button className="text-xl bg-blue-300 p-3 rounded-md border-blue-600 border-2 text-black">Archived lists</button>

            {isUserCreatingNewList && cognitoUser.username != undefined &&
                <div className="my-10 w-3/5 mx-auto bg-slate-300">
                    <form onSubmit={formik.handleSubmit} >
                        {/* Render your form inputs and submit button here */}
                        <div className="">
                            <label className="w-2/5 mx-10 justify-items-start">Roaster Name</label>
                            <input
                                className="w-2/5"
                                type="string"
                                name="list_name"
                                value={formik.values.list_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.list_name && formik.errors.list_name && (
                                <div>{formik.errors.list_name}</div>
                            )}
                        </div>

                        <div>
                            <label>Faction</label>
                            <select

                                className="bg-white w-2/5"
                                name="list_army"
                                value={formik.values.list_army}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="" label="Select a faction" />
                                {factions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.list_army && formik.errors.list_army && (
                                <div>{formik.errors.list_army}</div>
                            )}
                        </div>

                        <div>
                            <label>Points Limit</label>
                            <input
                                type="number"
                                className="w-4/5"
                                name="list_points"
                                value={formik.values.list_points}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.list_points && formik.errors.list_points && (
                                <div>{formik.errors.list_points}</div>
                            )}
                        </div>

                        <div>
                            <label>Publicly available</label>
                            <input
                                type="checkbox"
                                name="is_public"
                                value={formik.values.is_public}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.is_public && formik.errors.is_public && (
                                <div>{formik.errors.is_public}</div>
                            )}
                        </div>

                        <div>
                            <label>Description</label>
                            <input
                                className="w-4/5"
                                type="text"
                                name="list_description"
                                value={formik.values.list_description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.list_description && formik.errors.list_description && (
                                <div>{formik.errors.list_description}</div>
                            )}
                        </div>

                        {/* Repeat similar blocks for other form fields */}

                        <button type="submit">Submit</button>
                    </form>
                </div>}

            <div className="flex flex-row w-full items-center flex-wrap">
                {receivedLists != undefined && receivedLists?.map((list: any) => (
                    <Link to={list.list_id} key={list.list_id}>
                        <div className="w-96 relative h-36 bg-white border-2 rounded-xl border-black m-2 overflow-hidden">
                            <div className="absolute top-0 left-0 w-auto text-2xl text-customBlue font-bold text-justify p-2 z-50">{list.list_name}</div>
                            <div className="absolute bottom-0 left-0 flex flex-row items-end">
                            
                                <div className="bg-gray-400 py-1 px-2 m-2 rounded-xl font-semibold text-white">{list.list_points} Points</div>
                                <img
                                    className="px-4 z-20 pb-2 h-20"
                                    src={`/factions/${list.list_army}.png`}
                                    alt={`${list.list_army}`}
                                />
                            </div>

                            <div className="absolute bottom-0 right-0 h-full">
                                <img
                                    className="w-56 z-50 object-center"
                                    src={`/factions_backgrounds/Orks.png`}
                                    alt={`${list.list_army}`}
                                />

                                <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(-50deg, transparent,white 70%)' }}></div>
                            </div>

                            <div className="absolute bottom-1/3 right-0 text-5xl">
                                <BsThreeDotsVertical></BsThreeDotsVertical>
                            </div>

                        </div>
                    </Link>
                ))}
            </div>




        </div>
    )
};

export default MyLists;
