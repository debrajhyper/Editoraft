import { convertFromRaw, convertToRaw } from 'draft-js';
import { EDITOR_DATA_KEY } from '../constant/Constant';

export function setEditorData(editorData) {
    localStorage.setItem(EDITOR_DATA_KEY, JSON.stringify(convertToRaw(editorData)));
    return true;
}

export function getEditorData() {
    const editorData = localStorage.getItem(EDITOR_DATA_KEY);
    if (editorData) {
        return [true, convertFromRaw(JSON.parse(editorData))];
    }
    return [false];
}