import {YouTrackProject} from "./@types.ts";
import {EmbeddableWidgetAPI, HostAPI} from "../../@types/globals";

/**
 * Asynchronously fetches all projects from YouTrack.
 * @param host
 * @param setErrorMessage The function used to set an error message in case of failure.
 * @returns An array of YouTrackProject objects, or an empty array if there was an error.
 */
export async function fetchProjects(
    host: HostAPI | EmbeddableWidgetAPI,
    setErrorMessage: (value: string) => void,
) {
    try {
        const requestResponse = await host.fetchYouTrack('admin/projects?fields=name,id');
        return requestResponse as YouTrackProject[];
    } catch (error) {
        setErrorMessage(`There was an error loading the projects: ${error}`);
        return [];
    }
}

/**
 * Asynchronously fetches the current value of the flag from the backend.
 * @param host
 * @param setBackendFlagValue The function used to save the fetched flag value.
 * @param setErrorMessage The function used to set an error message in case of failure.
 * @returns The current value of the flag, or null if there was an error.
 */
export async function fetchBackendFlag(
    host: HostAPI | EmbeddableWidgetAPI,
    setBackendFlagValue: (value: boolean) => void,
    setErrorMessage: (value: string) => void,
) {
    try {
        const responseFlag = await host.fetchApp<{value: boolean}>(`backend/flag`, {
            method: 'GET',
        });

        setBackendFlagValue(responseFlag.value);
    } catch (error) {
        setErrorMessage(`There was an error fetching the flag: ${error}`);
    }
}

/**
 * Asynchronously changes the value of the flag in the backend. It first sends a PUT request to the endpoint,
 * then fetches the flag value to keep it consistent with the frontend in case of race conditions.
 * @param host
 * @param newValue The new value to set for the flag.
 * @param setErrorMessage The function used to set an error message in case of failure.
 * @returns The new value of the flag after the change, or null if there was an error.
 */
export async function changeBackendFlagValue(
    host: HostAPI | EmbeddableWidgetAPI,
    newValue: boolean,
    setErrorMessage: (value: string) => void,
) {
    try {
        await host.fetchApp<{value: boolean}>('backend/flag', {
            method: 'PUT',
            body: {
                value: newValue
            }
        });
    } catch (error) {
        setErrorMessage(`There was an error toggling the flag: ${error}`);
    }
}
