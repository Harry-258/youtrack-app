import { expect, describe, it, vi } from 'vitest';
import {changeBackendFlagValue, fetchBackendFlag, fetchProjects} from "./apiUtils.ts";
import {HostAPI} from "../../@types/globals";
import {YouTrackProject} from "./@types.ts";

describe('fetchProjects', () => {
    const mockedApiCallResult: YouTrackProject[] = [
        {
            name: 'test',
            id: 'test',
        },
        {
            name: 'test2',
            id: 'test2',
        }
    ]

    it('fetches projects and sets frontend data correctly', async () => {
        const setProjectsMock = vi.fn();
        const setFilteredProjectsMock = vi.fn();
        const setIsLoadingMock = vi.fn();
        const setErrorMessageMock = vi.fn();
        const hostMock = {
            fetchYouTrack: vi.fn().mockResolvedValue(mockedApiCallResult)
        } as unknown as HostAPI;

        await fetchProjects(hostMock, setProjectsMock, setFilteredProjectsMock, setIsLoadingMock, setErrorMessageMock);

        expect(hostMock.fetchYouTrack).toHaveBeenCalledExactlyOnceWith('admin/projects?fields=name,id');
        expect(setProjectsMock).toHaveBeenCalledExactlyOnceWith(mockedApiCallResult);
        expect(setFilteredProjectsMock).toHaveBeenCalledExactlyOnceWith(mockedApiCallResult);
        expect(setIsLoadingMock).toHaveBeenCalledExactlyOnceWith(false);
        expect(setErrorMessageMock).not.toHaveBeenCalled();
    })

    it('tries to fetch projects and fails correctly', async () => {
        const setProjectsMock = vi.fn();
        const setFilteredProjectsMock = vi.fn();
        const setIsLoadingMock = vi.fn();
        const setErrorMessageMock = vi.fn();
        const hostMock = {
            fetchYouTrack: vi.fn().mockRejectedValue(new Error("error message")),
        } as unknown as HostAPI;

        await fetchProjects(hostMock, setProjectsMock, setFilteredProjectsMock, setIsLoadingMock, setErrorMessageMock);

        expect(hostMock.fetchYouTrack).toHaveBeenCalledExactlyOnceWith('admin/projects?fields=name,id');
        expect(setProjectsMock).not.toHaveBeenCalled();
        expect(setFilteredProjectsMock).not.toHaveBeenCalled();
        expect(setIsLoadingMock).toHaveBeenCalledExactlyOnceWith(false);
        expect(setErrorMessageMock).toHaveBeenCalledExactlyOnceWith("There was an error loading the projects: Error: error message");
    })
})

describe('fetchBackendFlag', () => {
    it('fetches backend flag and sets frontend data correctly', async () => {
        const expectedFlagValue = true;
        const hostMock: HostAPI = {
            fetchApp: vi.fn().mockResolvedValue({value: expectedFlagValue}),
        } as unknown as HostAPI;
        const setBackendFlagValueMock = vi.fn();
        const setErrorMessageValueMock = vi.fn();

        await fetchBackendFlag(hostMock, setBackendFlagValueMock, setErrorMessageValueMock);

        expect(hostMock.fetchApp).toHaveBeenCalledExactlyOnceWith("backend/flag", {
            method: "GET",
        });
        expect(setBackendFlagValueMock).toHaveBeenCalledExactlyOnceWith(expectedFlagValue);
        expect(setErrorMessageValueMock).not.toHaveBeenCalled();
    })

    it('fetches backend flag and fails correctly', async () => {
        const hostMock: HostAPI = {
            fetchApp: vi.fn().mockRejectedValue(new Error("error message")),
        } as unknown as HostAPI;
        const setBackendFlagValueMock = vi.fn();
        const setErrorMessageValueMock = vi.fn();

        await fetchBackendFlag(hostMock, setBackendFlagValueMock, setErrorMessageValueMock);

        expect(hostMock.fetchApp).toHaveBeenCalledExactlyOnceWith("backend/flag", {
            method: "GET",
        });
        expect(setBackendFlagValueMock).not.toHaveBeenCalled();
        expect(setErrorMessageValueMock).toHaveBeenCalledExactlyOnceWith("There was an error fetching the flag: Error: error message");
    })
})

describe('changeBackendFlagValue', () => {
    it('fetches backend flag', async () => {
        const hostMock: HostAPI = {
            fetchApp: vi.fn().mockImplementation(() => {}),
        } as unknown as HostAPI;
        const setErrorMessageMock = vi.fn();
        const expectedFlagValue = false;

        await changeBackendFlagValue(hostMock, expectedFlagValue, setErrorMessageMock);

        expect(hostMock.fetchApp).toHaveBeenCalledExactlyOnceWith("backend/flag", {
            method: "PUT",
            body: {
                value: expectedFlagValue
            }
        });
        expect(setErrorMessageMock).not.toHaveBeenCalled();
    })

    it('fetches backend flag and fails correctly', async () => {
        const hostMock: HostAPI = {
            fetchApp: vi.fn().mockRejectedValue(new Error("error message")),
        } as unknown as HostAPI;
        const setErrorMessageMock = vi.fn();
        const expectedFlagValue = true;

        await changeBackendFlagValue(hostMock, expectedFlagValue, setErrorMessageMock);

        expect(setErrorMessageMock).toHaveBeenCalledExactlyOnceWith("There was an error toggling the flag: Error: error message");
        expect(hostMock.fetchApp).toHaveBeenCalledExactlyOnceWith("backend/flag", {
            method: "PUT",
            body: {
                value: expectedFlagValue
            }
        });
    })
})