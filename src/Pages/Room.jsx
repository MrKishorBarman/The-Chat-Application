import React, { useState, useEffect } from 'react'
import { databases, DATABASE_ID, COLLECTION_ID_MESSAGES, client } from '../appwriteConfig'

import { ID, Query, Permission, Role } from 'appwrite' // will generate document_id

import { Trash2 } from 'react-feather';

import Header from '../components/Header';
import { useAuth } from '../utils/AuthContext';


const Room = () => {

    const [messageBody, setMessageBody] = useState('')
    const [messages, setMessages] = useState([])

    const { user } = useAuth()

    useEffect(() => {
        getMessages();

        //* Subscribe to Multiple Channels [API -> Realtime]
        const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`, response => {

            // console.log('REAL TIME:', response);

            if (response.events.includes("databases.*.collections.*.documents.*.create")) {
                console.log('A MESSAGE IS CREATED')
                setMessages(prevState => [response.payload, ...prevState])
            }

            if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
                console.log('A MESSAGE IS DELETED!!!')
                setMessages(prevState => prevState.filter(message => message.$id !== response.payload.$id))
            }
        });
        return () => {
            unsubscribe()
        }
    }, [])

    // List document
    const getMessages = async () => {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(100)
            ]
        )
        console.log(response.documents)
        setMessages(response.documents)
    }

    // Create document
    const handleSubmit = async (e) => {
        e.preventDefault()

        const permissions = [
            Permission.write(Role.user(user.$id)),
        ]

        let payload = {
            user_id: user.$id,
            username: user.name,
            body: messageBody
        }

        let response = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            ID.unique(),
            payload,
            permissions
        )

        console.log('Created!', response)

        // setMessages(prevState => [response, ...messages])

        setMessageBody('')
    }

    // Delete Document
    const deleteMessage = async (message_id) => {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, message_id)
        // setMessages(prevState => messages.filter(message => message.$id !== message_id))
    }

    const options = {
        day: '2-digit',      
        month: '2-digit',    
        year: 'numeric',      
        hour: '2-digit',      
        minute: '2-digit',    
        hour12: true          
    }

    return (
        <main className='container'>
            <div className="sticky1">
                <Header />
            </div>

            <div className='room--container'>

                <div className="sticky2" >
                    <form
                        onSubmit={handleSubmit}
                        id="message--form">
                        <div>
                            <textarea
                                required
                                maxLength='250'
                                placeholder='Say something...'
                                onChange={(e) => { setMessageBody(e.target.value) }}
                                value={messageBody}
                            ></textarea>

                        </div>

                        <div className='send-btn--wrapper'>
                            <input
                                className='btn btn--secondary'
                                type="submit"
                                value='Send'
                            />
                        </div>

                    </form>
                </div>

                <div>
                    {messages.map(message => (
                        <div key={message.$id} className='message--wrapper'>

                            <div className='message--header'>
                                <p>
                                    {message?.username ? (
                                        <span>{message.username}</span>
                                    ) : (
                                        'Anonymous user'
                                    )}

                                    <small className="message-timestamp">{new Date(message.$createdAt).toLocaleString('en-GB', options)}</small>
                                </p>

                                {message.$permissions.includes(`delete("user:${user.$id}")`) && (
                                    <Trash2
                                        className='delete--btn'
                                        onClick={() => { deleteMessage(message.$id) }} />
                                )}
                            </div>

                            <div className={`message--body ${message.user_id === user.$id ? 'message--body--owner' : ''}`}>
                                <span>{message.body}</span>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

        </main>
    )
}

export default Room
