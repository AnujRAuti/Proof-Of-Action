export interface ImageComparisonPayload {
	beforeImg: File;
	afterImg: File;
	beforeCoords: [number, number];
	afterCoords: [number, number];
	beforeDate: string;
	afterDate: string;
}

export interface ImageComparisonResponse {
	response: string;
}

export async function compareImages(
	payload: ImageComparisonPayload,
	baseUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL
): Promise<ImageComparisonResponse> {
	const formData = new FormData();

	formData.append("before_img", payload.beforeImg);
	formData.append("after_img", payload.afterImg);

	formData.append("before_coords", JSON.stringify(payload.beforeCoords));
	formData.append("after_coords", JSON.stringify(payload.afterCoords));

	formData.append("before_date", payload.beforeDate);
	formData.append("after_date", payload.afterDate);

	const response = await fetch(`${baseUrl}/images/`, {
		method: "POST",
		body: formData,
	});

	if (!response.ok) {
		const errorBody = await response.text();
		throw new Error(`Failed to process images: ${response.status} - ${errorBody}`);
	}

	return response.json();
}
