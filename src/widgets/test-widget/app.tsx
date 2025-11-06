import React, {memo, useCallback, useState, useEffect} from 'react';
import {YouTrackProject} from "../../util/@types.ts";
import Toggle from "@jetbrains/ring-ui-built/components/toggle/toggle";
import {changeBackendFlagValue, fetchBackendFlag, fetchProjects} from "../../util/apiUtils.ts";

const host = await YTApp.register();

const AppComponent: React.FunctionComponent = () => {
    const [backendFlagValue, setBackendFlagValue] = useState<boolean>(true);
    const [projects, setProjects] = useState<YouTrackProject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        // Passing the setProjects method because it's an asynchronous function,
        // and it can't await in the useEffect hook to not assign a Promise object.
        fetchProjects(host, setProjects, setErrorMessage, setLoading);
        fetchBackendFlag(host, setBackendFlagValue, setErrorMessage);
    }, []);

    const toggleBackendFlag = useCallback(async () => {
        await changeBackendFlagValue(host, !backendFlagValue, setErrorMessage);

        // Calls fetch as well to persist in case of multiple toggles happening at the same time
        await fetchBackendFlag(host, setBackendFlagValue, setErrorMessage);
    }, [backendFlagValue]);

    // TODO: Set error message in components
  return (
    <div className="widget">
        <div className="widget-header">
            <h1>YouTrack App</h1>
            <p>Visualize your projects and save a boolean flag on the backend.</p>
        </div>

        <div className="widget-content">
            <Toggle
                checked={backendFlagValue}
                onChange={toggleBackendFlag}
            >
                Toggle backend flag
            </Toggle>
            <h2 className="list-title">Projects</h2>
            {loading && <div className="rich-list-item">Loading projects...</div>}
            {projects.map((project, index) =>
                <div className="rich-list-item" key={index}>
                    {/*{index > 0 && <hr className="divider"/>}*/}
                    <span key={index}>{project.name}</span>
                </div>
            )}
        </div>
    </div>
  );
};

export const App = memo(AppComponent);
