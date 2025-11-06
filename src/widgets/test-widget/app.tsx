import React, {memo, useCallback, useState, useEffect} from 'react';
import {YouTrackProject} from "../../util/@types.ts";
import Toggle from "@jetbrains/ring-ui-built/components/toggle/toggle";
import {changeBackendFlagValue, fetchBackendFlag, fetchProjects} from "../../util/apiUtils.ts";

const host = await YTApp.register();

const AppComponent: React.FunctionComponent = () => {
    const [backendFlagValue, setBackendFlagValue] = useState<boolean>(true);
    const [projects, setProjects] = useState<YouTrackProject[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<YouTrackProject[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchProjects(host, setProjects, setFilteredProjects, setIsLoading, setErrorMessage);
        fetchBackendFlag(host, setBackendFlagValue, setErrorMessage);
    }, []);

    const toggleBackendFlag = useCallback(async () => {
        await changeBackendFlagValue(host, !backendFlagValue, setErrorMessage);

        // Calls fetch as well to persist in case of multiple toggles happening at the same time
        await fetchBackendFlag(host, setBackendFlagValue, setErrorMessage);
    }, [backendFlagValue]);

    useEffect(() => {
        if (errorMessage) {
            host.alert(errorMessage);
        }
    }, [errorMessage]);

  return (
    <div className="widget">
      <div className="widget-header">
        <h1>Project Visualizer</h1>
        <p>Visualize your projects and save a boolean flag on the backend.</p>
      </div>

      <div className="widget-content">
        <h2>Projects</h2>

        <div className='widget-content-controls'>
          <div className='searchbar'>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7" cy="7" r="4.5" stroke="#6C707E"/>
              <path d="M10.1992 10.2002L13.4992 13.4961" stroke="#6C707E" strokeLinecap="round"/>
            </svg>
            <input
              placeholder='Filter projects by name'
              onChange={(e) => {
                            setFilteredProjects(
                                projects.filter(
                                    project => project.name.toLowerCase().includes(e.target.value.toLowerCase())
                                )
                            );
                        }}
              className='searchbar-input'
            />
          </div>

          <Toggle
            checked={backendFlagValue}
            onChange={toggleBackendFlag}
          >
            Toggle backend flag
          </Toggle>
        </div>

        {isLoading && filteredProjects.length === 0 && <div>Loading projects...</div>}

        <div className='list'>
          {filteredProjects.length === 0 && !isLoading && <h3 style={{color: "var(--ring-border-disabled-color)"}}>No projects found</h3>}

          {filteredProjects.map((project) => (
            <div key={project.id} className='list-element'>
              <h3 style={{color: "var(--ring-grey-fill-color)"}}>{project.name}</h3>
            </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export const App = memo(AppComponent);
