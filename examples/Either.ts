import axios, { AxiosError, AxiosResponse } from "axios";
import { Either, TryCatch } from "../lib/functional";

const url = "https://restcountries.eu/rest/v2/name/brazil";

async function getCountries() {
    return Either(TryCatch<AxiosError, AxiosResponse>(axios.get(url)));
}

export default async function Get() {
    const countries = await getCountries();
    if (countries.isRight) {
        console.log(countries.right.data);
    }
}

Get();
