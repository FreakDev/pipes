import { useState, useEffect } from "react"

const useDrag = ({ id, ref, onDragStart, onDragOver, onDragEnd }) => {
    const [dragState, updateDragState] = useState("draggable")
    const dragStartCb = ev => {
        updateDragState("dragStart")
        ev.dataTransfer.setData("source_id", id)
        onDragStart && onDragStart(ev)
    }
    const dragOverCb = ev => {
        updateDragState("dragging")
        onDragOver && onDragOver(ev)
    }

    const dragEndCb = ev => {
        updateDragState("draggable")
        onDragEnd && onDragEnd(ev)
    }
    useEffect(() => {
        const elem = ref.current
        if (elem) {
            elem.setAttribute("draggable", true)
            elem.addEventListener("dragstart", dragStartCb)
            elem.addEventListener("dragover", dragOverCb)
            elem.addEventListener("dragend", dragEndCb)
            return () => {
                elem.removeEventListener("dragstart", dragStartCb)
                elem.removeEventListener("dragover", dragOverCb)
                elem.removeEventListener("dragend", dragEndCb)
            }
        }
    }, [])
    return {
        dragState: dragState
    }
}

export default useDrag
