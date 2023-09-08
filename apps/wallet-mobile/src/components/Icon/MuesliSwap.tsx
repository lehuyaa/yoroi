import React from 'react'
import Svg, {G, Path} from 'react-native-svg'

type Props = {
  size?: number
}

export const MuesliSwap = ({size = 36}: Props) => (
  <Svg width={size} height={size} viewBox="0 0 36 36">
    <G fill="none" fillRule="evenodd">
      <Path
        d="M33.46 30.506c0-1.828-7.087-3.311-15.828-3.311S1.804 28.678 1.804 30.506c0 1.83 7.087 3.312 15.828 3.312 8.74 0 15.827-1.483 15.827-3.312"
        fill="#000"
      />

      <Path
        d="M35.936 14.11c-.038.212-.09.42-.152.627-.066.217-.14.433-.216.646a26.01 26.01 0 01-.761 1.822l-.002.002c-.064.132-.126.264-.188.396a54.73 54.73 0 01-1.377 2.629l-.32.575a73.448 73.448 0 01-2.521 4.159 47.27 47.27 0 01-1.868 2.695 25.478 25.478 0 01-.752.955c-.04.05-.083.1-.124.148-.321.386-.66.772-1.048 1.095-.407.339-.905.543-1.398.734-1.67.655-3.488.885-5.272.977-2.44.125-4.897-.016-7.287-.532-.928-.201-1.852-.457-2.723-.835a2 2 0 01-.234-.117c-.037-.022-.076-.043-.112-.068a2.805 2.805 0 01-.216-.152l-.094-.076-.022-.019a3.58 3.58 0 01-.173-.154 7.129 7.129 0 01-.41-.423 16.24 16.24 0 01-.344-.4l-.08-.097a.87.87 0 01-.061-.073 2.506 2.506 0 01-.065-.078c-.023-.025-.042-.05-.063-.076l-.107-.128a32.73 32.73 0 01-1.81-2.472l-.001-.004a64.662 64.662 0 01-1.487-2.333c-.5-.814-.987-1.636-1.455-2.47a59.486 59.486 0 01-1.552-2.927 61.428 61.428 0 01-.37-.772c-.234-.5-.457-1.005-.66-1.518-.224-.561-.438-1.14-.541-1.737-.05-.28.385-.399.434-.117.004.02.01.04.013.06 0 0 35.467-.222 35.419.057"
        fill="#8090FF"
      />

      <Path
        d="M34.805 17.207l-.189.396a53.907 53.907 0 01-1.376 2.628l-.32.577a73.426 73.426 0 01-2.521 4.157 47.29 47.29 0 01-1.869 2.696c-.24.324-.489.637-.746.948l-.005.007c-.04.05-.083.1-.123.148-.323.387-.66.77-1.049 1.094-.407.34-.905.544-1.399.735-1.669.655-3.487.885-5.27.977-2.44.125-4.898-.017-7.288-.533-.928-.2-1.852-.457-2.723-.834a2.15 2.15 0 01-.234-.117c-.037-.022-.076-.044-.112-.069a2.727 2.727 0 01-.216-.151l-.094-.076a5.668 5.668 0 01-.604-.596c-.11-.125-.217-.25-.32-.372l-.025-.027-.08-.098a1.356 1.356 0 01-.062-.073 2.506 2.506 0 01-.065-.078l-.062-.076a5.13 5.13 0 00-.107-.128l-.016-.02c12.345-.723 24.32-7.222 26.875-11.115"
        fill="#5165F7"
      />

      <Path
        d="M35.936 14.11c-.038.212-.09.42-.152.627-.066.217-.088.459-.216.646-2.58 3.73-9.013 5.695-17.873 6.44-6.45.54-12.16.18-14.502-.76a59.486 59.486 0 01-1.552-2.927 61.428 61.428 0 01-.37-.772c-.234-.5-.457-1.005-.66-1.518-.224-.561-.438-1.14-.541-1.737-.05-.28.385-.399.434-.117.004.02.01.04.013.06 0 0 35.467-.222 35.419.057"
        fill="#9FAFFF"
      />

      <Path
        d="M10.063 18.345c4.484.632 9.06.937 13.586.607 3.665-.267 7.88-.832 11.163-3.344.384-.294.867-.893 1.009-1.355.264-.855-2.014-3.7-17.356-4.167-7.485-.228-14.923.928-17.59 2.726-1.923 1.296.53 2.636 1.579 3.225 1.414.795 3 1.271 4.576 1.664 1.003.25 2.008.5 3.033.644"
        fill="#1841D3"
      />

      <Path
        d="M10.02 18.497c3.784.53 7.608.836 11.432.724 3.188-.093 6.502-.359 9.526-1.415a15.456 15.456 0 002.139-.926c.674-.358 1.372-.765 1.943-1.273.38-.339.815-.842.925-1.348a.678.678 0 00.004-.261c-.08-.498-.547-.883-.94-1.157-.913-.637-2.026-1.01-3.092-1.313-2.036-.581-4.15-.892-6.254-1.125a80.604 80.604 0 00-10.277-.492c-3.363.06-6.765.347-10.05 1.085-1.202.27-2.404.603-3.528 1.108-.784.352-2.086.973-1.81 2.015.129.49.55.873.94 1.175.424.325.888.594 1.355.857 1.54.862 3.243 1.353 4.955 1.777.904.224 1.81.435 2.733.569.202.028.29-.275.085-.304-.906-.13-1.796-.337-2.683-.556a32.062 32.062 0 01-2.513-.706c-1.295-.435-2.606-1.028-3.696-1.853-.373-.284-.86-.69-.892-1.19-.033-.548.549-.906.97-1.15.918-.527 1.95-.862 2.97-1.14 2.998-.822 6.144-1.157 9.244-1.308 3.433-.169 6.884-.04 10.308.246 2.307.193 4.62.47 6.876.992 1.243.287 2.511.639 3.638 1.245.501.27 1.05.617 1.29 1.103.015.028.017.023.035.088.01.035.02.07.025.106-.007-.04.003.028.002.061-.003.074.01-.004-.006.053-.153.588-.677 1.097-1.157 1.448a13 13 0 01-1.95 1.174c-2.697 1.325-5.743 1.75-8.72 1.974-3.658.276-7.335.146-10.98-.243a85.982 85.982 0 01-2.76-.344c-.203-.028-.29.275-.086.304"
        fill="#1841D3"
      />

      <Path
        d="M28.963 11.875c2.168.429 4.627 1.161 5.537 1.986.786.71-.849 1.693-2.32 2.254-5.046 1.925-9.1 2.376-14.472 2.26-3.425-.074-8.373-.923-10.796-1.465-2.225-.498-5.526-1.908-5.615-3.07.09-1.1 5.053-2.5 8.907-2.868 4.675-.446 10.54-.723 18.759.903"
        fill="#FFF"
      />

      <Path
        d="M1.795 17.53c1.357.87 2.927 1.363 4.44 1.9.195.07.279-.234.085-.303-1.488-.528-3.028-1.014-4.363-1.868-.174-.11-.335.162-.162.272m.895 1.899c2.53 1.233 5.351 1.993 8.145 2.363.202.027.29-.276.085-.303-2.764-.366-5.564-1.112-8.068-2.331-.185-.09-.348.181-.162.271m4.883.348c1.318.322 2.655.563 4 .751.2.03.288-.274.085-.303a41.048 41.048 0 01-4-.751c-.2-.049-.286.254-.085.303"
        fill="#5165F7"
      />

      <Path
        d="M18.138 12.172l.194-.12a.2.2 0 00.075-.067.208.208 0 00.048-.09.196.196 0 00.005-.103.194.194 0 00-.033-.098l-.041-.053a.263.263 0 00-.118-.068l-.071-.01a.279.279 0 00-.135.037l-.194.12a.19.19 0 00-.075.066.19.19 0 00-.048.09.2.2 0 00-.005.104.186.186 0 00.031.097l.042.054a.271.271 0 00.119.067l.07.01a.27.27 0 00.136-.036m1.132.829l.194-.119a.2.2 0 00.075-.068.208.208 0 00.048-.089.196.196 0 00.004-.104.194.194 0 00-.032-.098l-.042-.053a.263.263 0 00-.117-.067l-.072-.01a.279.279 0 00-.134.036l-.195.12a.19.19 0 00-.075.067.19.19 0 00-.048.089.2.2 0 00-.004.105c0 .035.011.067.031.097l.042.053a.271.271 0 00.119.067l.07.01a.27.27 0 00.135-.036m5.664 1.901l.194-.12a.2.2 0 00.075-.067.208.208 0 00.048-.09.196.196 0 00.005-.103.194.194 0 00-.032-.098l-.042-.053a.263.263 0 00-.118-.068l-.071-.01a.279.279 0 00-.135.037l-.194.12a.19.19 0 00-.075.066.19.19 0 00-.048.09.2.2 0 00-.004.104c0 .035.011.068.03.097.015.019.03.036.043.054a.271.271 0 00.118.067l.07.01a.27.27 0 00.136-.036m.627.799l.195-.118a.2.2 0 00.075-.069.208.208 0 00.048-.089.196.196 0 00.004-.104.194.194 0 00-.032-.097l-.041-.054a.263.263 0 00-.118-.067l-.071-.01a.279.279 0 00-.135.036l-.194.12a.19.19 0 00-.075.067.19.19 0 00-.048.09.2.2 0 00-.005.104.189.189 0 00.031.097l.042.053a.271.271 0 00.119.068l.07.01a.27.27 0 00.136-.037"
        fill="#8090FF"
      />

      <Path
        d="M16.945 7.282a1.203 1.203 0 01-.246.44c-.29.43-.731.967-1.142 1.068-.791.194-1.989-.197-2.805-.797-.49-.362-1.042-.984-1.11-1.46-.087-.61.133-1.372.53-1.9.07-.091.141-.175.22-.25l.206-.183c.023-.022.045-.044.068-.063l.011-.009h.002c.272-.208.62-.287 1.1-.213 1.196.028 2.285.82 2.888 1.88.036.064.07.128.101.196.195.403.31.86.177 1.29"
        fill="#FFE2A9"
      />

      <Path
        d="M11.133 2.804l-.602-1.063c-.068-.12-.246-.17-.366-.093a.263.263 0 00-.096.358l.602 1.063c.068.12.246.17.365.094a.265.265 0 00.097-.359m1.417-.742l-.074-1.017c-.01-.137-.116-.269-.268-.263-.136.006-.278.116-.267.263l.074 1.017c.01.136.116.269.267.262.136-.006.278-.116.267-.262M10.168 3.78a6.661 6.661 0 00-1.38-.413c-.137-.024-.295.037-.329.183-.03.128.04.296.187.323a6.328 6.328 0 01.973.254l.16.059.069.027c.009.003.1.04.05.019.07.029.13.047.206.027a.277.277 0 00.16-.12c.06-.113.041-.303-.096-.36"
        fill="#ED9F00"
      />

      <Path
        d="M20.504 15.28a1.35 1.35 0 01-.456.651c-.588.455-1.407.42-2.114.382-.177-.011-.393-.016-.57-.087a.563.563 0 01-.169-.102c-.185-.168-.138-.41-.014-.597a.228.228 0 01.058-.061c.116-.119.262-.185.407-.276.126-.079.22-.189.322-.294.24-.248.504-.496.821-.648.162-.077.33-.13.51-.144.174-.014.356.026.527.054.247.039.522.105.664.328a.679.679 0 01.038.07c.098.223.05.507-.024.725"
        fill="#FFE2A9"
      />

      <Path
        d="M20.504 15.28a1.35 1.35 0 01-.456.651c-.588.455-1.407.42-2.114.382-.177-.011-.393-.016-.57-.087 1.562-.402 1.925-1.471 3.164-1.67.098.223.05.507-.024.725"
        fill="#E8C079"
      />

      <Path
        d="M21.334 15.994c.086.257.24.484.457.65.587.455 1.406.42 2.114.382.176-.011.392-.016.568-.087a.563.563 0 00.17-.102c.185-.168.138-.41.014-.597a.228.228 0 00-.058-.061c-.116-.119-.262-.185-.407-.276-.126-.079-.22-.189-.322-.294-.24-.248-.504-.496-.82-.648a1.416 1.416 0 00-.51-.144c-.175-.014-.356.026-.527.054-.247.039-.522.105-.665.328a.679.679 0 00-.038.07c-.098.222-.049.507.024.725"
        fill="#FFE2A9"
      />

      <Path
        d="M21.334 15.994c.086.257.24.484.457.65.587.455 1.406.42 2.114.382.176-.011.392-.016.568-.087-1.56-.402-1.924-1.471-3.163-1.67-.098.222-.049.507.024.725"
        fill="#E8C079"
      />

      <Path
        d="M22.285 3.255a1.67 1.67 0 01-1.452 1.623c-.707.092-1.424-.278-1.73-.915-.253-.525-.16-1.022.051-1.536.328-.8.765-1.566 1.227-2.3a.274.274 0 01.462 0c.257.41.499.83.726 1.256.183.34.354.687.5 1.044.086.21.17.43.202.657l.014.17a.285.285 0 00-.012-.093l.006.094-.004.084.003-.012.007-.072z"
        fill="#83C7FF"
      />

      <Path
        d="M21.191 3.33a.762.762 0 01-.008.11l.01-.07a.79.79 0 01-.054.196l.027-.062a.81.81 0 01-.107.18l.042-.053a.842.842 0 01-.15.147l.054-.04a.82.82 0 01-.185.104l.064-.026a.832.832 0 01-.2.053l.07-.01a.81.81 0 01-.112.008c-.14.001-.274.12-.267.262a.268.268 0 00.267.262 1.11 1.11 0 00.767-.31c.202-.199.316-.472.317-.752a.267.267 0 00-.267-.262c-.145.006-.267.115-.268.262"
        fill="#187EB7"
      />

      <Path
        d="M34.21 10.675c-.136.697-.408 1.425-.882 1.963-1.59 1.816-3.188 2.797-5.474 3.14-.278.066-.45.004-.548-.062a.371.371 0 01-.107-.105 9.501 9.501 0 01-.417-4.83c.14-.8.394-1.604.902-2.248.51-.644 1.306-1.107 2.136-1.07.402.02.78.15 1.15.307.392.165.78.362 1.183.492.474.153.992.221 1.397.506.59.412.797 1.21.66 1.907M9.564 12.618c.18.264.247.72.07.988-.177.267-.588.56-.954.445-.024.327-.252 1.091-.951 1.201-.33.054-.67-.063-.927-.274-.002 0-.004-.002-.006-.004-.233.283-.733.282-1.165.083-.242-.112-.786-.634-.679-1.16-.27.279-.92.225-1.273-.032-.288-.207-.341-.7-.269-.978.083-.33.263-.564.505-.724l-.07-.014s-.122-.19-.118-.463a.92.92 0 01.116-.435l1.57-.672 1.038-1.623.187-.29a.842.842 0 01.55-.457c.26-.076.552-.06.79-.014.45.086.714.611.63 1.054.435-.197 1.082-.049 1.32.357.242.406.115.985-.276 1.257.185-.038.74.144.865.484.26.706-.367 1.459-.953 1.27"
        fill="#FF5A5A"
      />

      <Path
        d="M9.563 12.618c.182.264.248.72.072.988-.177.267-.589.56-.956.446-.023.325-.252 1.09-.95 1.2-.33.054-.67-.063-.927-.274.122-.164.288-.301.455-.423.078-.056.162-.115.2-.202.062-.143-.017-.301-.019-.457-.005-.307.281-.533.543-.7.26-.168.555-.37.588-.676.028-.276-.173-.517-.344-.738-.172-.22-.331-.51-.217-.765.078-.173.267-.277.342-.452.088-.2-.005-.442-.167-.59-.163-.148-.38-.222-.595-.277-.215-.055-.437-.096-.63-.199a1.13 1.13 0 01-.507-.542l.187-.292c.253-.537.89-.556 1.34-.47.449.087.714.61.63 1.054.435-.198 1.081-.05 1.32.357.243.406.116.984-.276 1.257.184-.038.74.144.864.484.26.706-.367 1.458-.953 1.271"
        fill="#EF4848"
      />

      <Path
        d="M6.368 11.33a1.397 1.397 0 00-.828 1.217 1.396 1.396 0 00.74 1.247c.512.26 1.206.17 1.534-.33.144-.219.182-.517.168-.77a1.927 1.927 0 00-.195-.757 1.272 1.272 0 00-.508-.545 1.136 1.136 0 00-.847-.088c-.332.086-.191.593.142.505a.59.59 0 01.411.022c.131.068.21.15.282.266.174.277.238.668.14.983a.474.474 0 01-.28.288.681.681 0 01-.523-.002.873.873 0 01-.526-.726.816.816 0 01.138-.515.91.91 0 01.422-.343c.133-.057.163-.246.097-.358-.08-.134-.234-.151-.367-.094"
        fill="#D81D1D"
      />

      <Path
        d="M7.364 10.965c.01-.02.022-.037.034-.056-.04.06.007-.002.021-.015l.03-.026c-.026.02-.027.021-.002.004.025-.015.05-.031.077-.045a.942.942 0 01.047-.02c.033-.01.065-.02.1-.028.01-.003.106-.017.063-.013l.086-.005a.94.94 0 01.408.087 1.9 1.9 0 01.18.1l.038.03a1.2 1.2 0 01.06.056c.02.02.038.04.056.062-.036-.042.023.033.03.042.017.027.033.055.048.083.005.01.042.096.025.053.022.057.04.116.05.176-.01-.065 0 .03 0 .043v.081a1.026 1.026 0 01-.021.125l-.029.088a.829.829 0 01-.02.04c-.013.026-.029.05-.045.075a.467.467 0 01-.055.054.291.291 0 01.006-.004c-.024.012-.046.025-.071.035-.132.057-.163.248-.096.36.08.133.233.15.367.094.241-.104.394-.361.458-.602a1.198 1.198 0 00-.069-.803c-.246-.557-.905-.865-1.505-.782-.282.04-.598.187-.733.447-.066.126-.034.285.095.359.12.068.3.032.367-.095m-.175-2.756c-.026.265-.009 1.318-.734 2.42-.738 1.128-2.188 1.005-2.728 1.057a.927.927 0 01.116-.435l1.57-.672L6.45 8.957l.188-.291a.838.838 0 01.551-.457"
        fill="#D81D1D"
      />

      <Path
        d="M6.285 6.685c-.005-.276.355-.335.5-.132.396.56.374 1.3.208 1.941l-.021.071-.032.127-.06.18-.068.173c-.355.915-.921 1.739-1.876 2.147-.567.243-1.205.319-1.82.296-.64-.025-1.233-.263-1.594-.798-.183-.271.202-.488.42-.318.133.103.284-.024.445-.2l.212-.242c.072-.08.146-.155.22-.21a.974.974 0 01.615-.218h.182a2.123 2.123 0 00-.109-.15L3.35 9.16a3.685 3.685 0 00-.186-.196l-.096-.09c-.388-.343-.598-.762-.58-1.28.004-.154.17-.32.338-.254.176.07.36.106.546.129l.56.057c.185.023.369.057.545.125.222.085.417.207.564.367l.034.04.01-.01.013-.015c.147-.174.322-.32.527-.466l.198-.141c.257-.188.47-.386.463-.742z"
        fill="#17CFE2"
      />

      <Path
        d="M15.084 15.73c-.631.216-1.34.171-1.961-.066-.223-.085-.434-.196-.653-.292a9.618 9.618 0 00-.822-.324 4.713 4.713 0 00-.406-.123c.208-.221.437-.567.484-.863.038-.24.019-.485.035-.727a2.4 2.4 0 01.88-1.683 2.504 2.504 0 011.852-.531 3.35 3.35 0 011.075.342c.153.075.304.158.438.262.1.071.19.155.27.25.056.067.103.14.143.218l.015-.008c.38.73.447 1.676.238 2.257-.22.616-.956 1.073-1.588 1.288z"
        fill="#EFB26A"
      />

      <Path
        d="M16.97 14.223c-.13.679-.655 1.166-1.256 1.48a3.19 3.19 0 01-2.27.298c-.405-.1-.772-.294-1.15-.46a7.433 7.433 0 00-1.112-.4c-.287-.074-.166-.508.122-.434.197.05.387.117.572.19.33-.333.875-.192 1.493-.263.542-.06 1.509-.303 1.905-.671.396-.365.52-.711.505-1.244-.008-.227-.077-.403-.032-.623.022-.101.2-.287.259-.37.101.07.191.153.27.249.01.011.017.023.026.036.101-.08.256-.084.33.06.014.027.028.056.04.084.302.638.428 1.373.297 2.068"
        fill="#E59E51"
      />

      <Path
        d="M16.587 12.02c-.265-.445-.755-.704-1.226-.895-1.01-.412-2.173-.289-2.99.459-.406.371-.693.88-.797 1.415-.058.3-.034.6-.06.902-.027.317-.194.591-.403.828a.197.197 0 00-.084.129l-.003.013a.226.226 0 00.029.162c.006.01.012.02.02.028.003.006.008.011.013.017l.016.015.011.01a.21.21 0 00.166.05c.518.043 1.018.21 1.535.263a4.287 4.287 0 001.776-.163c.93-.3 1.884-.88 2.15-1.863.121-.452.09-.96-.153-1.37"
        fill="#FFC98F"
      />

      <Path
        d="M12.562 14.024l.507-1.08c.07-.149.141-.3.252-.422.355-.394.993-.382 1.438-.676.033.352.066.71-.002 1.058-.069.347-.254.689-.566.867a1.685 1.685 0 01-.464.162c-.374.086-.783.04-1.165.091"
        fill="#FDB"
      />

      <Path
        d="M12.793 14.157l.408-.869c.11-.234.203-.523.421-.685.15-.113.36-.174.563-.237.244-.076.493-.154.71-.293l-.403-.227c.048.52.124 1.172-.28 1.578-.179.18-.46.254-.713.285-.31.037-.626.014-.937.053-.143.018-.267.108-.267.262 0 .128.123.28.267.263.688-.086 1.493.046 2.028-.493.519-.521.5-1.273.437-1.948-.018-.184-.218-.345-.403-.227-.418.27-.972.286-1.38.613-.237.19-.354.469-.478.734-.146.309-.29.618-.434.926-.061.128-.038.282.095.359.116.066.306.035.366-.094"
        fill="#FDB"
      />

      <Path
        d="M12.744 13.846l2.18-2.121s.636.802.09 1.693c-.545.891-2.133.817-2.455.802-.323-.014.185-.374.185-.374"
        fill="#E59E51"
      />

      <Path
        d="M34.211 10.675c-.136.697-.409 1.425-.882 1.963-1.592 1.816-3.19 2.796-5.476 3.141-.277.065-.45.004-.548-.063.818-.488 4.992-3.112 4.231-5.518-.19-.602-.857-.809-1.403-1.223-.791-.606-1.46-1.27-1.015-1.416.259-.085.537-.1.76-.092.254.007.438.045.438.045.39.166 1.433.619 1.837.749.473.154.991.222 1.397.507.311.217.518.544.62.907.093.321.105.672.041 1"
        fill="#EF4848"
      />

      <Path
        d="M29.36 9.627l.033-.171a.197.197 0 00.005-.104.185.185 0 00-.032-.098.198.198 0 00-.07-.073.197.197 0 00-.09-.048l-.07-.01A.27.27 0 0029 9.16a2.22 2.22 0 01-.054.04.263.263 0 00-.069.117c-.01.057-.022.113-.033.17a.2.2 0 00-.004.105.195.195 0 00.03.098c.018.03.041.055.07.073a.215.215 0 00.091.047l.072.009a.26.26 0 00.134-.036l.055-.04a.256.256 0 00.068-.116m2.167 1.013l.24-.31c.02-.03.03-.063.032-.098a.197.197 0 00-.004-.104.208.208 0 00-.049-.089.2.2 0 00-.074-.068.28.28 0 00-.207-.026l-.064.026a.274.274 0 00-.096.094l-.24.31a.194.194 0 00-.032.098.197.197 0 00.005.104.208.208 0 00.048.09.2.2 0 00.075.068.275.275 0 00.207.026l.063-.026a.274.274 0 00.096-.095m-1.73.469l-.094.486a.279.279 0 00.027.201.273.273 0 00.366.094.252.252 0 00.123-.156l.094-.485a.281.281 0 00-.027-.203.277.277 0 00-.16-.12.277.277 0 00-.206.027c-.056.035-.11.09-.123.156m-1.757.832c-.109.183-.198.38-.268.583a.263.263 0 00.027.201.277.277 0 00.16.12.28.28 0 00.207-.025.29.29 0 00.123-.158c.022-.066.048-.131.075-.195l-.027.062c.048-.111.103-.22.165-.323a.266.266 0 00.028-.202.273.273 0 00-.123-.157.275.275 0 00-.207-.027.278.278 0 00-.16.121m2.862.283a.944.944 0 01-.02.053l.027-.063a.628.628 0 01-.08.137l.041-.053-.011.014a.193.193 0 00-.056.085.186.186 0 00-.023.1.19.19 0 00.023.101c.011.033.03.06.056.085l.054.04a.259.259 0 00.134.036l.072-.009a.272.272 0 00.117-.067.997.997 0 00.11-.15 1.342 1.342 0 00.073-.17.2.2 0 00.004-.104.195.195 0 00-.031-.098.198.198 0 00-.07-.074.215.215 0 00-.09-.047l-.072-.008a.26.26 0 00-.135.035 2.22 2.22 0 00-.054.041.256.256 0 00-.069.116m-1.706.993l-.316.306a.196.196 0 00-.055.084.19.19 0 00-.023.101.19.19 0 00.023.102c.01.032.03.06.055.084.051.046.118.08.19.076a.277.277 0 00.188-.076c.106-.102.21-.204.317-.305a.204.204 0 00.055-.085.197.197 0 00.022-.101.194.194 0 00-.022-.1.193.193 0 00-.055-.086.271.271 0 00-.379 0"
        fill="#D81D1D"
      />

      <Path
        d="M16.945 7.28a1.09 1.09 0 01-.118.263c.094.06.15.173.07.292a4.122 4.122 0 01-.596.753 2.246 2.246 0 01-.209.18c-.295.223-.634.3-1.003.298-1.338-.009-2.892-.86-3.513-2.042-.302-.574-.195-1.281.042-1.861.201-.488.507-.847.896-1.195.22-.195.545.122.326.32-.156.14-.298.28-.424.433a.474.474 0 01.09.088c.126.174.105.404.124.616.038.41.247.792.54 1.086.293.293.685.463 1.061.641.616.296 1.647.22 1.825-.044.17-.25.16-.842.406-1.022a.518.518 0 01.307-.094c.195.402.309.86.176 1.289"
        fill="#ED9F00"
      />

      <Path
        d="M13.78 3.632c.131.003.261.019.39.046l.192.049c.963.207 1.792.831 2.349 1.637.32.466.59 1.039.557 1.614-.032.534-.33.993-.788 1.277-1.006.627-2.262.123-3.17-.44-.939-.584-1.677-1.558-1.489-2.7.076-.46.333-.929.718-1.212.245-.181.524-.256.814-.269.13-.024.271-.026.426-.002z"
        fill="#FFE2A9"
      />

      <Path
        d="M24.1 8.631c-.183.237-.358.418-.446.421-.252.01-1.117-.574-1.274-.713a.31.31 0 01-.1-.244c-.004-.18.086-.397.093-.589.004-.093.13-.695.226-.689.131.007.323.413.38.529.055.115.231.366.361.404.172.05 1.157-.24 1.334-.258.175-.016-.215.672-.574 1.14"
        fill="#17CFE2"
      />

      <Path
        d="M24.1 8.631c-.183.237-.358.418-.446.421-.252.01-1.117-.574-1.274-.713a.31.31 0 01-.1-.244c.235-.105.854-.238 1.82.536"
        fill="#00A5A5"
      />

      <Path
        d="M23.852 11.795c-.45.456-1.061.805-1.708.848-1.228.084-2.158-.852-2.511-1.779-.125-.335-.177-.67-.14-.953.068-.509.351-.985.77-1.346.756-.581 1.488-.519 2.173-.413.668.101 1.286.53 1.66 1.094.17.25.289.53.343.816.117.62-.14 1.275-.587 1.733"
        fill="#CB6DFC"
      />

      <Path
        d="M23.852 11.795c-.45.456-1.061.805-1.708.848-1.228.084-2.158-.852-2.511-1.779a.217.217 0 01.057-.018c.133-.028.267.032.389.094.238.125.643.202.911.237.828.11 1.21-.042 1.624-.257.352-.183.781-.734.973-1.25.061-.163.17-.3.287-.43.033-.036.18.032.223.006.17.25.288.53.342.816.117.62-.14 1.275-.587 1.733"
        fill="#B65EEF"
      />

      <Path
        d="M21.415 11.889c.216.07.442.114.668.139.064.007.146-.034.189-.076a.26.26 0 000-.371l-.054-.041a.273.273 0 00-.135-.036l-.03-.004.071.01a3.203 3.203 0 01-.566-.127.28.28 0 00-.207.027.273.273 0 00-.123.157.268.268 0 00.187.322"
        fill="#6A10C1"
      />

      <Path
        d="M13.593 4.966c.181.3.346.61.493.928.05.109.218.143.315.082.113-.072.136-.193.082-.31a9.29 9.29 0 00-.493-.928c-.061-.101-.21-.147-.314-.081-.105.066-.15.2-.083.309m.407.94a2.789 2.789 0 00-.946-.234c-.12-.008-.236.11-.23.226.005.128.1.216.23.225.056.004.112.01.169.017l-.062-.008a2.52 2.52 0 01.563.145c.007.003.015.005.022.009.016.006.009.003-.02-.01.014.003.03.014.042.02a.25.25 0 00.177.022.237.237 0 00.139-.103c.052-.099.034-.258-.083-.31m1.976.189a7.687 7.687 0 01-.843-.27.231.231 0 00-.283.158.224.224 0 00.023.173.262.262 0 00.137.104c.276.106.557.197.844.27.116.03.255-.038.283-.157a.229.229 0 00-.16-.278m-1.598.296c.203.338.439.658.7.956.08.09.246.086.326 0 .09-.095.084-.224 0-.319a5.853 5.853 0 01-.179-.213l-.021-.026c-.02-.025.024.031.004.006l-.04-.054a6.168 6.168 0 01-.392-.578c-.062-.102-.211-.147-.316-.082-.105.067-.148.2-.083.31"
        fill="#ED9F00"
      />

      <Path
        d="M6.01 25.806c.022.03.044.062.064.094a.171.171 0 01-.025-.03l-.002-.004a.602.602 0 01-.037-.06"
        fill="#6E86FF"
      />

      <Path
        d="M23.834 22.682c-1.142.126-2.294.174-3.44.256-.204.014-.206.33 0 .315 1.146-.082 2.298-.13 3.44-.256.203-.022.205-.337 0-.315m7.35-1.932c-1.854.76-3.764 1.396-5.751 1.717-.203.034-.117.337.085.304 1.988-.322 3.897-.958 5.751-1.718.187-.077.105-.38-.085-.303m1.047.492c-2.727 1.297-5.626 2.222-8.665 2.425-.205.013-.206.328 0 .314 3.099-.207 6.046-1.145 8.827-2.468.186-.088.023-.36-.162-.271m1.512-4.125c-2.304 1.613-5.032 2.306-7.802 2.666-.202.026-.205.341 0 .314 2.826-.367 5.613-1.062 7.964-2.708.167-.117.007-.39-.162-.272"
        fill="#1841D3"
      />

      <Path
        d="M33.038 18.56c-1.34.918-2.916 1.465-4.488 1.862-1.85.466-3.754.717-5.66.835-.204.013-.206.327 0 .314 1.934-.12 3.867-.373 5.745-.846 1.596-.402 3.206-.961 4.565-1.894.167-.115.008-.388-.162-.272m-1.427 3.865c-2.885 1.441-6.008 2.198-9.244 2.275-.207.006-.208.32 0 .315a22.102 22.102 0 009.406-2.318c.184-.092.022-.364-.162-.272m-1.82 2.814c-1.23.61-2.618.956-3.96 1.232-1.6.328-3.253.534-4.89.445-.207-.01-.206.304 0 .315 1.664.09 3.347-.123 4.975-.457 1.372-.281 2.78-.64 4.038-1.264.184-.091.022-.363-.163-.271m-.887 1.343c-1.192.618-2.615.872-3.929 1.096-1.642.281-3.315.45-4.982.443-.207 0-.207.314 0 .315 1.696.006 3.397-.168 5.067-.454 1.344-.23 2.788-.497 4.006-1.128.183-.095.02-.366-.162-.272m1.754-2.667c-.9.52-1.963.8-2.969 1.051a27.903 27.903 0 01-4.053.71 16.42 16.42 0 01-2.056.086c-.207-.005-.207.31 0 .315 1.31.036 2.625-.12 3.913-.334 1.301-.218 2.601-.506 3.85-.927.506-.171 1.015-.362 1.478-.63.177-.103.016-.374-.163-.271m-4.075 4.41c-2.963 1.04-6.125 1.077-9.237 1.033-.206-.003-.207.312 0 .315 3.139.045 6.333.005 9.323-1.045.193-.068.11-.371-.086-.303"
        fill="#1841D3"
      />

      <Path
        d="M34.17 9.675c-.998.231-1.92.231-3.393-.672-.596-.365-.844-1.137-.899-1.536.254.007.439.045.439.045.39.166 1.433.62 1.836.749.474.154.992.223 1.396.507.312.217.518.544.622.907"
        fill="#D81D1D"
      />

      <Path
        d="M34.934 9.19c-.258.28-.665.353-1.033.312a12.969 12.969 0 01-1.538-.27c-.575-.142-1.2-.317-1.662-.698-.348-.31-.623-.672-.775-1.11-.133-.376-.192-.793-.238-1.187-.092-.827.185-1.922 1.177-2.07.484-.069.871.189 1.108.559.151.237.24.518.252.79a2.78 2.78 0 01-.08.723c-.027.123-.06.245-.095.367-.02.072-.035.196-.066.289l-.006.015-.03.062c-.001.004-.001.007-.003.01h.005c.04-.023.087-.033.126-.058a.89.89 0 00.228-.228c.116-.156.195-.334.299-.497.22-.346.545-.61.969-.664.377-.05.748.096.968.404a.946.946 0 01.165.392.825.825 0 01-.118.581c-.19.302-.532.457-.848.604-.095.043-.202.084-.282.153-.07.063-.086.069-.025.117.094.075.346.02.457.016.335-.012.685.06.934.28a.787.787 0 01.123.13c.226.293.243.7-.012.977"
        fill="#17CFE2"
      />

      <Path
        d="M32.225 5.517c.01.242-.028.486-.08.722-.027.122-.06.246-.095.366-.02.073-.035.198-.067.29l-.005.016-.03.061s-.25.406-.434.225c-.185-.18.637-1.58.459-2.47.15.235.24.517.252.79"
        fill="#00A5A5"
      />

      <Path
        d="M16.3 8.588a2.145 2.145 0 01-.208.18c-.294.223-.634.3-1.002.299-1.34-.01-2.893-.86-3.514-2.042l.133-.109s.458.823 2.015 1.504c.835.365 1.64.439 2.576.168"
        fill="#ED9F00"
      />

      <Path
        d="M16.97 14.223c-.13.679-.655 1.166-1.256 1.48a3.19 3.19 0 01-2.131.327c1.431-.03 2.472-.923 3.006-1.971.37-.723.18-1.538.083-1.904.302.638.428 1.373.297 2.068"
        fill="#CC823A"
      />

      <Path
        d="M27.003 29.494a5.67 5.67 0 01-.395.365c-.408.339-.905.543-1.399.734-1.67.655-3.488.885-5.271.977-2.44.125-4.898-.016-7.288-.533-.929-.2-1.851-.457-2.723-.834-.642-.276-1.139-.861-1.581-1.381.228.24 1.874 1.791 6.563 2.122 5.09.357 9.303.179 12.09-1.449l.004-.001"
        fill="#1841D3"
      />

      <Path
        d="M33.596 7.366c.313-.168 1.172-.572 1.11-1.002l-.001-.032a.824.824 0 01-.118.58c-.19.302-.532.457-.848.604-.095.043-.202.085-.281.153-.072.063-.47.251-.47.07 0-.18.293-.206.608-.373"
        fill="#00A5A5"
      />
    </G>
  </Svg>
)
