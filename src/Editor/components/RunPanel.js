import React from "react"

const RunPanel = ({ show, getRef }) => {
    return (
        <div style={{ display: (show ? "block" : "none") }}>
            <iframe ref={ r => getRef(r) } src="runner-for-editor.html"></iframe>
        </div>
    )
}

export default RunPanel