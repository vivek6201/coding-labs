import { NextRequest, NextResponse } from "next/server";
import {
  KubeConfig,
  AppsV1Api,
  CoreV1Api,
  NetworkingV1Api,
} from "@kubernetes/client-node";
import { readAndParseYaml } from "../../../lib/utils";

export const POST = async (req: NextRequest) => {
  const { slug: labSlug } = await req.json();
  const namespace = "default";

  const kubeConfig = new KubeConfig();
  kubeConfig.loadFromDefault();
  const coreV1Api = kubeConfig.makeApiClient(CoreV1Api);
  const appsV1Api = kubeConfig.makeApiClient(AppsV1Api);
  const networkingV1Api = kubeConfig.makeApiClient(NetworkingV1Api);
  try {
    const manifests = readAndParseYaml(labSlug);

    for (const manifest of manifests) {
      switch (manifest.kind) {
        case "Deployment":
          await appsV1Api.createNamespacedDeployment(namespace, manifest);
          break;
        case "Service":
          await coreV1Api.createNamespacedService(namespace, manifest);
          break;
        case "Ingress":
          await networkingV1Api.createNamespacedIngress(namespace, manifest);
          break;
        default:
          console.log(`Unsupported kind: ${manifest.kind}`);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Resources created successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "failed to create resources!",
      },
      { status: 500 }
    );
  }
};
