import { createLabValidations } from "@repo/lib/src/validations";
import { NextRequest, NextResponse } from "next/server";
import { S3Instance } from "../../../lib/utils";

export const POST = async (req: NextRequest) => {
  const reqBody: {
    slug: string;
    template: string;
  } = await req.json();

  const { data, success, error } =
    await createLabValidations.safeParseAsync(reqBody);

  if (!success) {
    return NextResponse.json({
      success: false,
      error: error.issues.map((issue) => {
        return {
          message: issue.message,
          path: issue.path[0],
        };
      }),
    });
  }

  const { slug, template } = data;

  try {
    await S3Instance.copyS3Folder(`base/${template}`, `labs/${slug}`);
    return NextResponse.json(
      {
        success: true,
        message: "Lab Created successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "error while creating lab",
    },{status: 500});
  }
};
