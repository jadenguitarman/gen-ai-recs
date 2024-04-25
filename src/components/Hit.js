import Image from "next/image";
import styles from "./Hit.module.css";
import Link from 'next/link';
import { useState, useEffect } from 'react';


const requestOpenAI = async (movieData, setData, setLoading) => {
	console.log(movieData)

	const resp = await fetch(
		`/gpt/${btoa(
			unescape(
				encodeURIComponent(
					JSON.stringify(
						{
							title: movieData.title
						}
					)
				)
			)
		)}`,
		{ method: 'post' }
	);

	setData(
		(await resp.json())
	);
	setLoading(false);
};

const PersonalizedPitch = ({ movieData }) => {
	const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);

	useEffect(() => {requestOpenAI(movieData, setData, setLoading)}, []);

	if (isLoading) return <>Loading...</>;
    if (!data) return <>No profile data</>;
	if (data.error) return <>{data.message}</>;
    return <>{data.data}</>;
};

const InnerHit = ({ movieData, fullSize, generatedPitch }) => (
	<div className={`${styles.hitDetails} ${fullSize ? "" : styles.smallerHit}`}>
		<Image
			src={!!movieData.poster_path ? movieData.poster_path : "/unknown-poster.png"}
			width={135}
			height={200}
			alt={movieData.title}
			className={styles.hitImage}
		/>
		<span className={styles.hitTitle}>{movieData.title}</span>
		<span className={styles.hitOverview}>{generatedPitch ? <PersonalizedPitch movieData={movieData} /> : movieData.overview}</span>
		{
			fullSize
				? (
					<>
						<span className={styles.hitGenre}>{movieData.genre}</span>
						<span className={styles.hitCast}>{!!movieData.cast.length ? `Starring: ${movieData.cast.join(", ")}` : ""} </span>
						<span className={styles.hitYear}>{movieData.year}</span>
					</>
				)
				: null
		}
	</div>
);

const Hit = ({ movieData, fullSize, linked, generatedPitch }) => {
	if (fullSize !== false) fullSize = true; // if it wasn't explicitly set to false, assume its true (the default)
	if (linked !== true) linked = false; // if it wasn't explicitly set to true, assume its false (the default)
	if (generatedPitch !== true) generatedPitch = false; // if it wasn't explicitly set to false, assume its true (the default)

	return linked
		? (
			<Link
				href={{
					pathname: '/movie',
					query: {
						movie: btoa(
							unescape(
								encodeURIComponent(
									JSON.stringify(
										movieData
									)
								)
							)
						)
					}
				}}
			>
				<InnerHit
					movieData={movieData}
					fullSize={fullSize}
					generatedPitch={generatedPitch}
				/>
			</Link>
		)
		: (
			<InnerHit
				movieData={movieData}
				fullSize={fullSize}
				generatedPitch={generatedPitch}
			/>
		);
};

export default Hit;
