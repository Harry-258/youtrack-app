import React, {memo, useCallback, useState, useEffect} from 'react';
import Button from '@jetbrains/ring-ui-built/components/button/button';
import {YouTrackProject} from "../../util/@types.ts";

const host = await YTApp.register();

const AppComponent: React.FunctionComponent = () => {
    const [backendFlagValue, setBackendFlagValue] = useState<boolean>();
    const [projects, setProjects] = useState<YouTrackProject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        // const fetchProjects = async () => {
        //     try {
        //         const requestResponse = await host.fetchYouTrack('admin/projects?fields=name,team');
        //         setProjects(requestResponse as YouTrackProject[]);
        //     } catch (error) {
        //         console.error(`Error fetching projects: ${error}`);
        //         setError(true);
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        // fetchProjects();

        const fetchBackendFlag = async () => {
            try {
                const response = await host.fetchApp('backend/flag', {
                    method: 'GET',
                });
                // @ts-ignore
                const value = response.value;
                // @ts-ignore
                console.log(`Backend flag is ${response.value} | response is: ${JSON.stringify(response)}`);
                setBackendFlagValue(value === "true");
            } catch (error) {
                console.log(`Error fetching backend flag: ${error}`);
            }
        }
        fetchBackendFlag();
    }, []);

    const toggleBackendFlag = useCallback(async () => {
        try {
            const response = await host.fetchApp('backend/flag', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {value: !backendFlagValue},
            });
            // @ts-ignore
            const newValue = response.value;
            setBackendFlagValue(newValue);
            console.log(`Backend new flag set to ${newValue} | response is: ${JSON.stringify(response)}`);
        } catch (error) {
            console.error(`Error setting backend flag: ${error}`);
        }
    }, [backendFlagValue]);

  return (
    <div className="widget">
      <Button primary onClick={toggleBackendFlag}>Toggle Backend</Button>
        <div>Backend flag state is: {backendFlagValue}</div>
        {loading && <div>Loading projects...</div>}
        {error && <div>Error loading projects</div>}

        {projects.map((project, index) =>
            <div key={index}>{project.name}</div>
        )}
    </div>
  );
};

export const App = memo(AppComponent);
