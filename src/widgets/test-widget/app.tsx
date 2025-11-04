import React, {memo, useCallback, useState, useEffect} from 'react';
import Button from '@jetbrains/ring-ui-built/components/button/button';
import {YouTrackProjectsResponse, YouTrackProject} from "../../util/@types.ts";

const host = await YTApp.register();

const AppComponent: React.FunctionComponent = () => {
    const [backendFlagValue, setBackendFlagValue] = useState(false);
    const [projects, setProjects] = useState<YouTrackProject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchProjects = async () => {
            const response: Response = await host.fetchYouTrack('admin/projects?fields=name,team');
            if (response.ok) {
                const responseProjects = await response.json();
                setProjects(responseProjects.body as YouTrackProjectsResponse);
                setLoading(false);
            } else {
                console.error(`Error fetching projects: ${response.statusText}`);
                setError(true);
            }
        };
        fetchProjects();
    }, []);

    const toggleBackendFlag = useCallback(async () => {
        const requestResponse: Response = await host.fetchApp('backend/saveFlag', {method: 'POST', body: {value: !backendFlagValue}});
        if (requestResponse.ok) {
            const response = await requestResponse.json();
            setBackendFlagValue(response.value);
            console.log(`Backend flag changed to ${response.value}`);
        } else {
            console.error(`Error toggling backend flag: ${requestResponse.statusText}`);
        }
    }, [backendFlagValue]);

  return (
    <div className="widget">
      <Button primary onClick={toggleBackendFlag}>Toggle Backend</Button>
        <span>Backend flag state is: {}</span>
        {loading && <div>Loading projects...</div>}
        {error && <div>Error loading projects</div>}
        {projects.map((project, index) =>
            <div key={index}>{project.name + " " + project.team}</div>
        )}
    </div>
  );
};

export const App = memo(AppComponent);
