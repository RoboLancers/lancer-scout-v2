import React, { useRef, useState } from "react"

import Webcam from "react-webcam"
import jsqr from "jsqr"
import { generateDataFromBuffer } from "../scripts/dataBuffer"

const testForm = [
    {
        "title": "General",
        "ui": {
            "type": "header"
        }
    },
    {
        "title": "Scout Name",
        "ui": {
            "type": "text"
        },
        "dataType": "string"
    },
    {
        "title": "Match Number",
        "ui": {
            "type": "number"
        },
        "dataType": "8bit"
    },
    {
        "title": "Team",
        "ui": {
            "type": "dropdown",
            "options": ["321 RoboLancers", "427 Lance-A-Bot", "433 Firebirds"]
        },
        "dataType": "6bit"
    },
    {
        "title": "Alliance",
        "ui": {
            "type": "radio",
            "options": ["Red", "Blue"]
        },
        "dataType": "1bit"
    },
    {
        "title": "Autonomous",
        "ui": {
            "type": "header"
        }
    },
    {
        "title": "Lane",
        "ui": {
            "type": "radio",
            "options": ["Bump", "No Bump", "Charging Station"]
        },
        "dataType": "2bit"
    },
    {
        "title": "Auto Cubes Low",
        "ui": {
            "type": "number"
        },
        "dataType": "2bit"
    },
    {
        "title": "Auto Cubes Mid",
        "ui": {
            "type": "number"
        },
        "dataType": "2bit"
    },
    {
        "title": "Auto Cubes High",
        "ui": {
            "type": "number"
        },
        "dataType": "2bit"
    },
    {
        "title": "Auto Cones Low",
        "ui": {
            "type": "number"
        },
        "dataType": "2bit"
    },
    {
        "title": "Auto Cones Mid",
        "ui": {
            "type": "number"
        },
        "dataType": "2bit"
    },
    {
        "title": "Auto Cones High",
        "ui": {
            "type": "number"
        },
        "dataType": "2bit"
    },
    {
        "title": "Successfully Taxied",
        "ui": {
            "type": "toggle"
        },
        "dataType": "boolean"
    },
    {
        "title": "Auto Balance",
        "ui": {
            "type": "radio",
            "options": ["Not Applicable", "Engaged", "Docked"]
        },
        "dataType": "2bit"
    },
    {
        "title": "Teleop",
        "ui": {
            "type": "header"
        }
    },
    {
        "title": "Teleop Cubes Low",
        "ui": {
            "type": "number"
        },
        "dataType": "6bit"
    },
    {
        "title": "Teleop Cubes Mid",
        "ui": {
            "type": "number"
        },
        "dataType": "6bit"
    },
    {
        "title": "Teleop Cubes High",
        "ui": {
            "type": "number"
        },
        "dataType": "6bit"
    },
    {
        "title": "Teleop Cones Low",
        "ui": {
            "type": "number"
        },
        "dataType": "6bit"
    },
    {
        "title": "Teleop Cones Mid",
        "ui": {
            "type": "number"
        },
        "dataType": "6bit"
    },
    {
        "title": "Teleop Cones High",
        "ui": {
            "type": "number"
        },
        "dataType": "6bit"
    },
    {
        "title": "Endgame",
        "ui": {
            "type": "header"
        }
    },
    {
        "title": "Time Left When Starting Balance",
        "ui": {
            "type": "radio",
            "options": ["0-10 Seconds", "10-20 Seconds", "20-30 Seconds", "30+ Seconds"]
        },
        "dataType": "2bit"
    },
    {
        "title": "Time Taken To Balance",
        "ui": {
            "type": "radio",
            "options": ["0-5 Seconds", "5-10 Seconds", "10-15 Seconds", "15+ Seconds"]
        },
        "dataType": "2bit"
    },
    {
        "title": "Teleop Balance",
        "ui": {
            "type": "radio",
            "options": ["Not Applicable", "Engaged", "Docked"]
        },
        "dataType": "2bit"
    },
    {
        "title": "Teleop Balance Partners",
        "ui": {
            "type": "radio",
            "options": ["Not Applicable", "Alone", "1 Partner", "2 Partners"]
        },
        "dataType": "2bit"
    },
    {
        "title": "Post Game",
        "ui": {
            "type": "header"
        }
    },
    {
        "title": "Team Points Scored",
        "ui": {
            "type": "number"
        },
        "dataType": "8bit"
    },
    {
        "title": "Penalties",
        "ui": {
            "type": "number"
        },
        "dataType": "6bit"
    },
    {
        "title": "Quality Of Defense",
        "ui": {
            "type": "slider"
        },
        "dataType": "4bit"
    },
    {
        "title": "Quality Under Defense",
        "ui": {
            "type": "slider"
        },
        "dataType": "4bit"
    },
    {
        "title": "Speed",
        "ui": {
            "type": "slider"
        },
        "dataType": "4bit"
    },
    {
        "title": "Driver Skill",
        "ui": {
            "type": "slider"
        },
        "dataType": "4bit"
    },
    {
        "title": "Cycle Speed",
        "ui": {
            "type": "radio",
            "options": ["Slow", "Medium", "Fast"]
        },
        "dataType": "2bit"
    },
    {
        "title": "Broke Down / Disconnected",
        "ui": {
            "type": "toggle"
        },
        "dataType": "boolean"
    },
    {
        "title": "Comments",
        "ui": {
            "type": "text"
        },
        "dataType": "string"
    }
]

const form = testForm.filter(e => e.ui.type != "header")

const ScanPage = () => {
    const webcamRef = useRef()
    const canvasRef = useRef()

    return (
        <div>
            <div>Hello React Web Client</div>
            <Webcam ref={webcamRef} onClick={() => {
                const snapshot = webcamRef.current.getScreenshot()

                const tempImg = new Image()
                tempImg.src = snapshot
                tempImg.onload = () => {
                    const ctx = canvasRef.current.getContext("2d")
                    
                    ctx.drawImage(tempImg, 0, 0, 640, 480)
                    const imageData = ctx.getImageData(0, 0, 640, 480)

                    const output = jsqr(imageData.data, 640, 480)

                    if(output == null){
                        console.log("youre a bum")
                    } else {
                        const buffer = []

                        for (let i = 0;i<output.data.length;i++) buffer.push(output.data.charCodeAt(i))

                        const data = generateDataFromBuffer(buffer, form)

                        const receipt = {
                            id: data.id,
                            map: Object.fromEntries(form.map((entry, index) => [ entry.title, data.entries[index] ]))
                        }
                        
                        console.log(receipt)
                    }
                }
            }} />
            <canvas ref={canvasRef} width={640} height={480} />
        </div>
    )
}

export default ScanPage