export const downloadFile = ({
    data,
    fileName,
    fileType
}: {
    data: BlobPart,
    fileName: string,
    fileType: string
}) => {
    const blob = new Blob([data], { type: fileType });
    const a = document.createElement('a');
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
}

export const readJsonFile = async <N>(file: File): Promise<N> => {
    return new Promise((resolve, reject) => {
        if (file.type.indexOf('json') < 0) reject(`Only accept text/json files! file '${file.name}' has type '${file.type}'`);
        const reader = new FileReader();
        reader.onload = e => {
            if (!e.target) reject(`Error loading file '${file.name}'`);
            resolve(JSON.parse(e.target!.result! as string));
        };
        reader.readAsText(file);
    });
};
