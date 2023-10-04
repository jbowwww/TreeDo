import { useState, ChangeEvent, useEffect, useRef, Attributes } from 'react';

export interface EditableTextProps extends Attributes {
    id: string;
    value?: string;
    isEditing?: boolean;
    onChange?: (value: string) => void;
    onEditing?: () => void;
    onBlur?: (value: string) => void;
    onEnded?: (value: string) => void;
};

export const EditableText = (props: EditableTextProps) => {
    const [isEditing, setIsEditing] = useState(props.isEditing ?? false);
    const [text, setText] = useState<string | undefined>(props.value);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDoubleClick = () => {
        setIsEditing(true);
        props.onEditing?.();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
        props.onChange?.(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        props.onBlur?.(inputRef?.current?.value ?? "");
    };

    const handleEnded = () => {
        props.onEnded?.(text ?? "");
    }

    // Focus the input field when editing starts
    useEffect(() => {
        if (isEditing) {
            inputRef?.current?.focus();
        }
    }, [isEditing]);

    return (
        <div id={props.id}>
            {isEditing ?
                <input
                    type="text"
                    id={props.id}
                    value={text ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onEnded={handleEnded}
                    ref={inputRef}
                /> : text ?
                    <span onDoubleClick={handleDoubleClick}>{text}</span>
                    : <span onDoubleClick={handleDoubleClick}>&nbsp;</span>
            }
        </div>);
};

export default EditableText;
