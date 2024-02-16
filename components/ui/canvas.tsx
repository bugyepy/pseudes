import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Circle, Text, Rect } from "react-konva";
import useImage from "use-image";

type ImageProps = {
  image: File;
  handlePestedUrlChange: (pestedUrl: string) => void;
};

const CanvasComponent = ({ image, handlePestedUrlChange }: ImageProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const [canvasWidth, setCanvasWidth] = useState<number>(375);
  const [canvasHeight, setCanvasHeight] = useState<number>(375);
  const [srcWidth, setSrcWidth] = useState<number | null>(null);
  const [srcHeight, setSrcHeight] = useState<number | null>(null);
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const stageRef = useRef<Konva.Stage>(null);
  const [isGuideView, seIisGuideView] = useState(true);

  useEffect(() => {
    if (!image) return;

    const url = URL.createObjectURL(image);
    setImageUrl(url);
  }, [image]);

  const [imageData] = useImage(imageUrl);

  // 画像サイズの取得と変更
  useEffect(() => {
    setSrcWidth(imageData?.width ?? null);
    setSrcHeight(imageData?.height ?? null);

    if (!(srcWidth && srcHeight)) return;

    // 375*375の枠内に収まるように画像サイズを変更する
    if (1 > srcWidth / srcHeight) {
      setWidth(srcWidth * (375 / srcHeight));
      setCanvasWidth(srcWidth * (375 / srcHeight));
      setHeight(srcHeight * (375 / srcHeight));
      setCanvasHeight(srcHeight * (375 / srcHeight));
    } else {
      setWidth(srcWidth * (375 / srcWidth));
      setCanvasWidth(srcWidth * (375 / srcWidth));
      setHeight(srcHeight * (375 / srcWidth));
      setCanvasHeight(srcHeight * (375 / srcWidth));
    }
  }, [imageData?.width, imageData?.height, srcWidth, srcHeight, width]);

  useEffect(() => {
    if (isGuideView || !stageRef.current) return;

    handlePestedUrlChange(stageRef.current.toDataURL());
  }, [handlePestedUrlChange, isGuideView, stageRef]);

  const handleDragStart = () => {
    seIisGuideView(false);

  };

  const handleDragEnd = () => {
    if (stageRef.current) {
      handlePestedUrlChange(stageRef.current.toDataURL());
    };

    if (isGuideView) {
      seIisGuideView(false);
      return;
    }

    seIisGuideView(true);
  };

  return (
    <Stage width={canvasWidth} height={canvasHeight} ref={stageRef}>
      <Layer>
        <Image image={imageData} width={width} height={height} alt="" />
      </Layer>
      <Layer
        draggable={true}
        onDragStart={handleDragStart}
        onDragEnd ={handleDragEnd}
      >
        {isGuideView && (
          <Rect
            stroke="violet"
            strokeWidth={3}
            x={5}
            y={5}
            width={195}
            height={50}
            opacity={0.6}
          />
        )}

        <Circle fill="white" x={20} y={20} radius={7.5} />
        <Circle stroke="white" strokeWidth={2} x={40} y={20} radius={7} />
        <Circle stroke="white" strokeWidth={2} x={60} y={20} radius={7} />
        <Text
          text={"SHOT ON TAKANASHI G5"}
          x={13}
          y={32}
          fontSize={18}
          fontFamily={"Carlito"}
          fill="white"
        />
      </Layer>
    </Stage>
  );
};

export default CanvasComponent;
