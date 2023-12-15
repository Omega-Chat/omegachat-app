import React from 'react';
import { User } from '../entities/User';
import { useNavigate } from 'react-router-dom';
import { primary, userCardBackground } from '../theme/colors';


interface Props {
    data: User
}



const UserChatCard: React.FC<Props> = ({data}) => {
    
    const navigate = useNavigate();

    // const handleAdquireClick = () => {
    //     if (data.ipfsHash) {
    //         const ipfsLink = `${data.ipfsHash}`; // Construct the IPFS link
    //         window.open(ipfsLink, '_blank'); // Open the link in a new tab or window
    //     }
    // };


    return (
        <div className='container'>
                <div className="info" style={{ borderRadius: 15, background: userCardBackground, marginTop: 5, marginBottom: 5}}>
                    <div className="user-name" style={{display: "flex", flexDirection: "row"}}>
                    {data.online && 
                    <>
                        <h4
                            style={{
                                fontSize: 20,
                                marginLeft: 10,
                                flex: 4
                            }}>{data.name}</h4>
                        <button
                            style={{
                                backgroundColor: primary,
                                color: "white",
                                borderRadius: 5,
                                fontSize: 15,
                                height: 30,
                                alignSelf: "center",
                                flex: 2,
                                marginRight: 10

                            }}
                            onClick={() => navigate("/chat")}>Start Chat</button>
                    </>
                    }
                        
        
                        
                    </div >
                    {/* <div className="info-desc">
                        <h5 className="author">Author: {data.author}</h5>
                        <h5 className="year">Year: {Number(data.year)}</h5>
                        <button onClick={handleAdquireClick} className="buy-button" >ADQUIRIR OBRA</button>
                    </div> */}
                </div>
        </div>

    )
};


export default UserChatCard;