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
	ARTICLE = "ARTICLE",
	SAVE_PROCESS = "SAVE_PROCESS",
	SAVE_SUCCESS = "SAVE_SUCCESS"
}

function Head() {
	return (
		<>
			<link rel="stylesheet" type='text/css' href={chrome.runtime.getURL('app.css')} />		
		</>
	);
}

function App() {

	const [pageState, setPageState] = useState<PageState>(PageState.LANDING);
	
	const handleMultiselectClick = () => {
		setPageState(PageState.MUTLISELECT);
	}

	const handleArticleClick = () => {
		setPageState(PageState.ARTICLE);
	}

	useEffect(()=> {
		const el = (document.getElementById("krisinote-clipper-iframe") as HTMLIFrameElement).contentDocument?.getElementById("krisinote-pages-container");
		if(el){
			const heightOfBody = window.getComputedStyle((document.getElementById("krisinote-clipper-iframe") as HTMLIFrameElement).contentDocument?.getElementById("krisinote-pages-container") as HTMLElement).height;
			(document.getElementById("krisinote-clipper-iframe") as HTMLElement).style.height = heightOfBody;
		}
	},[pageState])

	return (
		<>
			<Frame
				id='krisinote-clipper-iframe'
				style={{
					// pointerEvents: 'none',
				}}
				
				head={<Head/>}
			>
				<style>
					
				</style>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
					}}
				>

					<div
						style={{
							pointerEvents: 'auto',
							height: "auto"
						}}
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
						pageState === PageState.SAVE_SUCCESS? <SaveSuccessPage /> : null
					}
					</div>
					<div
						style={{
							flex: "1",
							pointerEvents: "none"
						}}
					>

					</div>
				</div>

				</Frame>		
		</>
	);
}

export default App;
