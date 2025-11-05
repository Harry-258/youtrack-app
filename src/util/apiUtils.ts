import {YouTrackProject} from "./@types.ts";
import {EmbeddableWidgetAPI, HostAPI} from "../../@types/globals";

/**
 * Asynchronously fetches all projects from YouTrack.
 * @param host
 * @param setProjects The function used to save the fetched projects.
 * @param setError The function used to set the error state.
 * @param setLoading The function used to set the loading state.
 */
export async function fetchProjects(
    host: HostAPI | EmbeddableWidgetAPI,
    setProjects: (projects: YouTrackProject[]) => void,
    setError: (value: boolean) => void,
    setLoading: (value: boolean) => void,
) {
    try {
        const requestResponse = await host.fetchYouTrack('admin/projects?fields=name');
        setProjects(requestResponse as YouTrackProject[]);
    } catch (error) {
        console.error(`Error fetching projects: ${error}`);
        setError(true);
    } finally {
        setLoading(false);
    }
}

/**
 * Asynchronously fetches the current value of the flag from the backend.
 * @param host
 * @returns The current value of the flag, or null if there was an error.
 */
export async function fetchBackendFlag(host: HostAPI | EmbeddableWidgetAPI): Promise<boolean | null> {
    try {
        const responseFlag = await host.fetchApp<{value: boolean}>(`backend/flag`, {
            method: 'GET',
        });

        console.log(
            `Flag value is: ${responseFlag.value}`
        );
        return responseFlag.value;
    } catch (error) {
        console.error(`Error fetching backend flag: ${JSON.stringify(error)}`);
        return null;
    }
}

/**
 * Asynchronously changes the value of the flag in the backend. It first sends a PUT request to the endpoint,
 * then fetches the flag value to keep it consistent with the frontend in case of race conditions.
 * @param host
 * @param newValue The new value to set for the flag.
 * @returns The new value of the flag after the change, or null if there was an error.
 */
export async function changeBackendFlagValue(host: HostAPI | EmbeddableWidgetAPI, newValue: boolean): Promise<boolean | null> {
    try {
        await host.fetchApp<{value: boolean}>('backend/flag', {
            method: 'PUT',
            body: {
                value: newValue
            }
        });

        return await fetchBackendFlag(host);
    } catch (error) {
        console.error(`Error toggling flag: ${JSON.stringify(error)}`);
        return null;
    }
}
