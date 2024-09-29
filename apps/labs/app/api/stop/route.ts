import { readAndParseYaml } from "../../../lib/utils";
import {
  KubeConfig,
  CoreV1Api,
  AppsV1Api,
  NetworkingV1Api,
} from "@kubernetes/client-node";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { slug: labSlug } = await req.json();
  const namespace = "default";

  const kubeConfig = new KubeConfig();
  kubeConfig.loadFromDefault();
  const coreV1Api = kubeConfig.makeApiClient(CoreV1Api);
  const appsV1Api = kubeConfig.makeApiClient(AppsV1Api);
  const networkingV1Api = kubeConfig.makeApiClient(NetworkingV1Api);

  try {
    const manifests = readAndParseYaml(
      labSlug
    );

    for (const manifest of manifests) {
      switch (manifest.kind) {
        case "Deployment":
          await appsV1Api.deleteNamespacedDeployment(
            manifest.metadata.name,
            namespace
          );
          break;
        case "Service":
          await coreV1Api.deleteNamespacedService(
            manifest.metadata.name,
            namespace
          );
          break;
        case "Ingress":
          await networkingV1Api.deleteNamespacedIngress(
            manifest.metadata.name,
            namespace
          );
          break;
        default:
          console.log(`Unsupported kind: ${manifest.kind}`);
      }
    }

    return new NextResponse("Resources deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting resources:", error);
    return new NextResponse("Failed to delete resources", { status: 500 });
  }
};
