import WildfireCaseStudy from "@/components/WildfireCaseStudy";

export const metadata = {
  title: "Wildfire Image Detection Case Study & Journey — Aaron Nguyen",
  description:
    "A lightweight 3-stage convolutional neural network detecting early-stage wildfire ignitions from aerial imagery in under 15ms.",
};

export default function FireCNNPage() {
  return <WildfireCaseStudy />;
}
