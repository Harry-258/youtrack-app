import React, {memo, useCallback, useState, useEffect} from 'react';
import {YouTrackProject} from "../../util/@types.ts";
import Toggle from "@jetbrains/ring-ui-built/components/toggle/toggle";
import Button from "@jetbrains/ring-ui-built/components/button/button";

const host = await YTApp.register();

const AppComponent: React.FunctionComponent = () => {
    const [backendFlagValue, setBackendFlagValue] = useState<boolean>(true);
    const [projects, setProjects] = useState<YouTrackProject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [userID, setUserID] = useState<string>("");

    useEffect(() => {
        /**
         * Fetches all projects from YouTrack.
         */
        const fetchProjects = async () => {
            try {
                const requestResponse = await host.fetchYouTrack('admin/projects?fields=name');
                setProjects(requestResponse as YouTrackProject[]);
            } catch (error) {
                console.error(`Error fetching projects: ${error}`);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();

        /**
         * Fetches the current value of the flag from the backend.
         */
        const fetchBackendFlag = async () => {
            try {
                const responseId = await host.fetchYouTrack<{ id: string }>('users/me');
                setUserID(responseId.id);

                const responseFlag = await host.fetchApp<{
                    value: boolean
                }>(`backend/flag`);
                setBackendFlagValue(responseFlag.value);

                console.log(
                    `Flag value is: ${responseFlag.value}`
                )
            } catch (error) {
                console.error(`Error fetching backend flag: ${JSON.stringify(error)}`);
            }
        }
        fetchBackendFlag();
    }, []);

    /**
     *
     */
    const toggleBackendFlag = useCallback(async () => {
        const newFlagValue = !backendFlagValue;
        try {
            // const response = await host.fetchApp<{value: boolean}>(`backend/flag`, {
            //     method: 'POST',
            //     body: {
            //         value: newFlagValue
            //     },
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            // });

            const response = await host.fetchApp<{value: boolean}>('backend/flag', {
                method: 'PUT',
                query: {
                    value: newFlagValue
                }
            })

            setBackendFlagValue(response.value);
            console.log(
                `New flag value is: ${JSON.stringify(response)} ${response.value}`
            )
        } catch (error) {
            console.error(`Error toggling flag: ${JSON.stringify(error)}`);
        }
    }, [backendFlagValue]);

  return (
    <div className="widget">
        <Toggle
            checked={backendFlagValue}
            onChange={toggleBackendFlag}
        >
            Switch backend flag
        </Toggle>
        <Button onClick={async () => {
            const response = await host.fetchApp<{value: boolean}>(`backend/flag`, {
                method: 'GET',
            });
            console.log(`Response is: ${JSON.stringify(response)}`);
        }}>Test storage</Button>
        {loading && <div>Loading projects...</div>}
        {error && <div>Error loading projects</div>}

        {projects.map((project, index) =>
            <span key={index}>{project.name}</span>
        )}
    </div>
  );
};

export const App = memo(AppComponent);
