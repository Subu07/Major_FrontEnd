import React, {useState, useEffect} from "react";
import {Button, Paper, CircularProgress, Typography} from "@material-ui/core";
import {useSpring, animated} from "react-spring";
import "./App.css";

export default function App() {
    const [address, setAddress] = useState(null);
    const [load, setLoad] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [imageAnimate, setImageAnimate] = useSpring(() => ({
        opacity: 1,
        config: {tension: 30}
    }));

    useEffect(() => {
        //console.log(address);
    },[address]);

    setImageAnimate({
        opacity: processing ? 0.7 : 1
    });

    const handleProcess = () => {
        setProcessing(!processing);
        let connection = new WebSocket('ws://localhost:8765');
        connection.onopen = function () {
            connection.send(address.split(',')[1]);
        };
        connection.onmessage = function (e) {
            const reader = new FileReader();
            reader.readAsDataURL(e.data);
            reader.onloadend = () => {
                console.log()
            };
        };

    };

    const handleImage = e => {
        const reader = new FileReader();
        const file = e.target.files[0];
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setAddress(reader.result);
            setLoad(false);
        };
    };

    const paperStyle = {
        height: '85vh',
        width: '97vw',
        marginLeft: 20,
        marginTop: 20,
        alignSelf: 'center',
        backgroundColor: 'transparent'
    };
    // if (!load) {
    //     paperStyle.backgroundColor = 'red';
    // }

    return (
        <div style={{position: 'relative'}}>
            <Typography variant={"h4"} style={{textAlign: "center"}}>Building Footprint Extraction</Typography>
            <Paper elevation={12} style={paperStyle}>
                {!load ? <animated.img src={address} alt={""} style={imageAnimate} className={"imageStyle"}/> :
                    <Typography variant={"h4"}
                                style={{position: 'relative', opacity: 0.4, textAlign: 'center', top: '50%'}}>Upload
                        Image</Typography>}
            </Paper>
            {processing && <CircularProgress style={{position: "absolute", top: '50%', left: '50%'}} size={50}/>}
            <br/>
            <label htmlFor="imageUpload">
                <Button variant={"contained"} color={"primary"} style={{marginLeft: '32vw'}}>
                    Upload
                </Button>
            </label>
            <Button
                disabled={load}
                onClick={handleProcess}
                variant={"contained"}
                color={"secondary"}
                style={{marginLeft: '20vw'}}
            >
                Segment
            </Button>
            <input
                onChange={handleImage}
                id="imageUpload"
                type="file"
                style={{display: "none"}}
            />
        </div>
    )
        ;
}
