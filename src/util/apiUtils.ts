import {YouTrackProject} from "./@types.ts";
import {EmbeddableWidgetAPI, HostAPI} from "../../@types/globals";

/**
 * Asynchronously fetches all projects from YouTrack.
 * @param host The host object used to make calls to the backend extension.
 * @param setProjects Method used to save the fetched projects.
 * @param setFilteredProjects Method used to save the fetched projects.
 * @param setIsLoading Method used to indicate that the projects have been retrieved.
 * @param setErrorMessage The function used to set an error message in case of failure.
 */
export async function fetchProjects(
    host: HostAPI | EmbeddableWidgetAPI,
    setProjects: (projects: YouTrackProject[]) => void,
    setFilteredProjects: (projects: YouTrackProject[]) => void,
    setIsLoading: (isLoading: boolean) => void,
    setErrorMessage: (value: string) => void,
) {
    try {
        const requestResponse = await host.fetchYouTrack('admin/projects?fields=name,id');
        setProjects(requestResponse as YouTrackProject[]);
        setFilteredProjects(requestResponse as YouTrackProject[]);
        setIsLoading(false);
    } catch (error) {
        setErrorMessage(`There was an error loading the projects: ${error}`);
        setIsLoading(false);
    }
}

/**
 * Asynchronously fetches the current value of the flag from the backend.
 * @param host The host object used to make API calls to the YouTrack backend.
 * @param setBackendFlagValue The function used to save the fetched flag value.
 * @param setErrorMessage The function used to set an error message in case of failure.
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
 * @param host The host object used to make API calls to the backend extension.
 * @param newValue The new value to set for the flag.
 * @param setErrorMessage The function used to set an error message in case of failure.
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
