import React, { useEffect, useState } from 'react';
import LandingPage from './components/pages/LandingPage';
import MultiselectPage from './components/pages/MultiselectPage';
import SaveProcessPage from './components/pages/SaveProcessPage';
import SaveSuccessPage from './components/pages/SaveSuccessPage';
import Frame from 'react-frame-component';
// import "./app.css";


enum PageState {
	LANDING = "LANDING",
	MUTLISELECT = "MULTISELECT",
	SAVE_PROCESS = "SAVE_PROCESS",
	SAVE_SUCCESS = "SAVE_SUCCESS"
}

function App() {

	const [pageState, setPageState] = useState<PageState>(PageState.LANDING);
	
	const handleMultiselectClick = () => {
		setPageState(PageState.MUTLISELECT);
	}

	// useEffect(()=> {
	// 	const el = (document.getElementById("krisinote-clipper-iframe") as HTMLIFrameElement).contentDocument?.getElementById("krisinote-pages-container");
	// 	if(el){
	// 		const heightOfBody = window.getComputedStyle((document.getElementById("krisinote-clipper-iframe") as HTMLIFrameElement).contentDocument?.getElementById("krisinote-pages-container") as HTMLElement).height;
	// 		(document.getElementById("krisinote-clipper-iframe") as HTMLElement).style.height = heightOfBody;
	// 	}
	// },[pageState])

	return (
		<>
			<Frame
				id='krisinote-clipper-iframe'
				style={{
					height: "400px",
				}}
				initialContent="<!DOCTYPE html><html><head></head><body style='margin: 0;'><div></div></body></html>"
			>
				<style>
					
				</style>

				<div
					id='krisinote-pages-container'
				>

					{
						pageState === PageState.LANDING ? 
						<LandingPage 
							onMultiSelectClick={handleMultiselectClick}
						/> : null
					}
					{
						pageState === PageState.MUTLISELECT ? <MultiselectPage /> : null
					}
					{
						pageState === PageState.SAVE_PROCESS ? <SaveProcessPage /> : null
					}
					{
						pageState === PageState.SAVE_SUCCESS ? <SaveSuccessPage /> : null
					}
				</div>

			</Frame>		
		</>
	);
}

export default App;
