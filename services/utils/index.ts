import {randomUUID} from "crypto";
import * as fs from "fs";

interface IProps {
    url: string;
    pageProduct: number;
}

export const formationUrlGetHtml = ({url, pageProduct}: IProps): string => {
    return `${url}?pageSize=${pageProduct}&PAGEN_1=${1}`
}

export const formationUrlListProducts = ({url, pageProduct}: IProps): string => {
    return `${url}?pageSize=${pageProduct}&PAGEN_1=`
}

export const saveJsonFormat = (name, data) => {
    const res = JSON.stringify(data, null, 2);
    fs.writeFileSync(`${name}_${randomUUID()}.json`, res);
}