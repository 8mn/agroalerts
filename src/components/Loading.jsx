import Style from "./Loading.module.scss";

const Loading = () => {
	return (
		<div className={Style.loading}>
			{/* <div>Loading</div> */}

			<div className={Style.loader}></div>
		</div>
	);
};

export default Loading;
