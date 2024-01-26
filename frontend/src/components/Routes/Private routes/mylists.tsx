import { Auth } from "aws-amplify";
import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { CognitoUserContext, isUserAuthenticatedContext } from "../../../App";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

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
    const [selectedList, setSelectedList] = useState<Lists | undefined>();

    const [opt1, setOpt1] = useState('ASD')


    const [player_id, setPlayer_id] = useState<number | undefined>()

    useEffect(() => {
        if (cognitoUser != undefined) {

            console.log('fetching user id for mylists')
            fetch(apiPaths.playersAPIEndpoint + apiPaths.player + "/" + cognitoUser.username + '/id', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => (res.json()))
                .then((id) => {
                    console.log("User id: ", id[0].player_id)
                    setPlayer_id(id[0].player_id)
                })

        }
    }, [cognitoUser])


    const handleListClick = (list) => {
        setSelectedList(list);
    };

    const handleCloseModal = () => {
        setSelectedList(undefined);
    };

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
            values.player_id = player_id!
            createList(values as Lists)
            console.log(values);
        },
    });

    useEffect(() => {
        console.log('is user authenticated: ', isUserAuthenticated)
        if (isUserAuthenticated == true) {
            getUserLists()
            getUserInfo()
        }
    }, [isUserAuthenticated])

    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const [optionsPosition, setOptionsPosition] = useState({ top: 0, left: 0 });

    const handleOptionsClick = (event, listId) => {
        // Prevent the click from triggering the handleCloseModal function
        event.stopPropagation();

        // Get the position of the click
        const clickX = event.clientX;
        const clickY = event.clientY;

        // Get the scroll position
        const scrollX = window.pageXOffset;
        const scrollY = window.pageYOffset;
        setOpt1(listId)
        // Set the position for the options block
        setOptionsPosition({ top: clickY + scrollY, left: clickX + scrollX });

        // Toggle the visibility
        setIsOptionsVisible(!isOptionsVisible);
    };

    // Add event listener on component mount
    useEffect(() => {
        document.addEventListener("click", handleDocumentClick);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [isOptionsVisible]);

    const handleDocumentClick = (event) => {
        // Close the options block if it's visible and the click is outside of it
        if (isOptionsVisible && !event.target.closest(".options-block")) {
            setIsOptionsVisible(false);
        }
    };


    function getUserLists() {
        console.log('fetching lists')
        console.log(cognitoUser)
        fetch(apiPaths.playersAPIEndpoint + apiPaths.player + "/" + cognitoUser.username + '/lists', {
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
            <button className="text-xl bg-green40k p-3 rounded-md text-white font-semibold m-2" onClick={() => setIsUserCreatingNewList(true)}>Create new list</button>
            <button className="text-xl bg-green40k p-3 rounded-md text-white font-semibold m-2">Archived lists</button>

            {isUserCreatingNewList && cognitoUser.username != undefined &&
                <div className="my-10 px-10 py-4 w-2/5 mx-auto bg-slate-300">
                    <form onSubmit={formik.handleSubmit} >
                        {/* Render your form inputs and submit button here */}
                        <div className="">
                            <label className="w-2/5">Roaster Name</label>
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
                                className="w-2/5"
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
                                className="w-2/5"
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
                            <textarea
                                className="w-2/5 bg-white"
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
                    <div key={list.list_id} onClick={() => handleListClick(list)}>
                        <div className="w-96 relative h-36 bg-white border-2 rounded-xl shadow-lg border-black mx-10 m-3 overflow-hidden hover:cursor-pointer">
                            <div className="absolute top-0 left-0 w-auto text-2xl text-green40k font-bold text-justify p-2 z-40">{list.list_name}</div>
                            <div className="absolute bottom-0 left-0 flex flex-row items-end">

                                <div className="bg-black40klight py-1 px-2 m-2 rounded-xl font-semibold text-white">{list.list_points} Points</div>
                                <img
                                    className="px-4 max-w-36 z-20 pb-2 max-h-20"
                                    src={`/factions/${list.list_army}.png`}
                                    alt={`${list.list_army}`}
                                />
                            </div>

                            <div className="absolute bottom-0 right-0 h-full">
                                <img
                                    className="w-56 z-40 object-center"
                                    src={`/factions_backgrounds/custom-army.jpeg`}
                                    alt={`${list.list_army}`}
                                />

                                <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(-50deg, transparent,white 70%)' }}></div>
                            </div>

                            <div className="absolute bottom-1/3 right-0 text-5xl">
                                <BsThreeDotsVertical onClick={(event) => handleOptionsClick(event, list.list_id)} />
                            </div>

                        </div>
                    </div>
                ))}


                {/* Options block */}
                {isOptionsVisible && (
                    <div
                        className=" absolute rounded-xl border-[2px] border-black40k z-50 options-block"
                        style={{ top: optionsPosition.top, left: optionsPosition.left }}
                    >
                        {/* Add your options or buttons here */}
                        <div className="bg-white40k text-black40k py-2 px-8 rounded-t-lg" onClick={() => console.log("Option 1 clicked for List ID:")}>Edit list</div>
                        <div className="bg-red40k text-white40k py-2 px-8 rounded-b-lg" onClick={() => console.log("Option 2 clicked for List ID:")}>Remove list</div>
                    </div>
                )}

                {/* Modal or overlay for displaying list details */}
                {selectedList && (
                    <div
                        className="fixed top-0 z-50 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
                        onClick={handleCloseModal}
                    >

                        <div className="relative bg-white p-4 rounded-md shadow-xl w-2/5 h-3/5 overflow-y-auto flex flex-col">
                            {/* Render the details of the selected list here */}
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-0 right-0 text-4xl rounded-md border-black m-2 hover:cursor-pointer hover:bg-red40k hover:text-white40k"
                            >
                                <IoMdClose />
                            </button>
                            <div className="pb-2 flex flex-row justify-between items-center ">
                                <img
                                    className="h-20 mx-2"
                                    src={`/factions/${selectedList.list_army}.png`}
                                    alt={`${selectedList.list_army}`}
                                />
                                <p className="text-2xl overflow-visible font-bold flex-grow text-green40k font-arial-black">{selectedList.list_name}</p>

                            </div>

                            <div className="p-4 px-10 whitespace-pre-wrap overflow-y-auto">
                                {/* Only the content inside this div will scroll */}
                                {selectedList.list_description}
                            </div>
                        </div>

                    </div>
                )}
            </div>




        </div >
    )
};

export default MyLists;
