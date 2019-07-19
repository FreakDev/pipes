import { useState, useEffect } from "react"

const useDrop = ({ ref, onDrop, onDragOver, onDragLeave }) => {
    const [dropState, updateDropState] = useState("droppable")
    const dropOverCb = ev => {
        ev.preventDefault()
        updateDropState("dragging over")
        onDragOver && onDragOver(ev)
    }

    const dragLeaveCb = ev => {
        onDragLeave && onDragLeave(ev)
    }

    const dropCb = ev => {
        ev.preventDefault()
        onDrop(ev)
        updateDropState("dropped")
    }
    useEffect(() => {
        const elem = ref.current
        if (elem) {
            elem.addEventListener("dragover", dropOverCb)
            elem.addEventListener("dragleave", dragLeaveCb)
            elem.addEventListener("drop", dropCb)
            return () => {
                elem.removeEventListener("dragover", dropOverCb)
                elem.removeEventListener("dragleave", dragLeaveCb)
                elem.removeEventListener("drop", dropCb)
            }
        }
    })
    return {
        dropState
    }
}

export default useDrop
