import Image from "next/image";
import Link from "next/link";

export default function Guide() {
  return (
    <div className="body-container">
      <main className="guide-container w-full h-full flex flex-col items-center py-12" >
        <div className="box-container flex flex-col gap-4 w-1/2">
          <h1 className="text-4xl font-bold text-center whitespace-nowrap">
            앱스토어 스크린샷이 처음이라면?
          </h1>
          <hr className="w-full mx-auto my-8" />

          <h2 className="text-3xl font-bold">
            앱 스토어 스크린샷이란?
          </h2>
          <div className="text-lg">
            앱을 다운받는 '앱스토어'에 등록할 앱의 스크린샷 이미지입니다. 앱을 스토어에 올리려면 필수로 제출해야 하는 항목이에요. 개발한 화면을 그대로 캡처해서 등록할 수도 있지만, 사용자들이 우리 앱의 특징을 더 쉽게 파악할 수 있도록 제작하는 것이 좋습니다. 다만 규정을 지키지 않으면 아무리 내용이 좋아도 소용없어요! 그러니 꼭 플랫폼별 규정을 지켜 제작하도록 합시다.
          </div>

          <h3 className="text-2xl font-bold mt-8">
            {'1. 아이폰 앱의 경우, <Appstore> 규정'}
          </h3>
          <div className="text-lg">
            앱스토어는 플레이스토어보다 스크린샷 규정이 까다로운 편이에요. 잘못하면 스크린샷 때문에 앱 등록이 반려(reject)될 수 있으니, 첫 앱 배포라면 특히 주의깊게! 확인해보세요.
          </div>
          <Image src="/images/guide_appstore.png" alt="Appstore 스크린샷 규정" width={1080} height={1000} className="my-8" />

          <h4 className="text-xl font-bold mt-4">
            {'1) 크기 규정'}
          </h4>
          <div className="text-lg">
            모바일 앱의 경우, 2가지 사이즈를 필수로 등록해야 합니다. (각 사이즈별로 두 가지 옵션 중 하나를 선택하여 등록하면 됩니다!)
          </div>
          <div className="text-lg">
            ① iPhone 6.9 디스플레이 (필수)
            <ul className="text-lg list-disc ml-8">
              <li className="text-lg">
                1320 x 2868px | 2868 x 1320px
              </li>
              <li className="text-lg">
                1290 x 2796px | 2796 x 1290px
              </li>
            </ul>
          </div>
          <div className="text-lg">
            ② iPhone 6.5 디스플레이 (필수)
            <ul className="text-lg list-disc ml-8">
              <li className="text-lg">
                1242 × 2688px | 2688 × 1242px
              </li>
              <li className="text-lg">
                1284 × 2778px | 2778 × 1284px
              </li>
            </ul>
          </div>
          <div className="text-lg">
            ③ 5.5 디스플레이 등 기타 사이즈
            <div className="text-lg ml-4">
              {'[미디어 관리에서 모든 크기 보기] 버튼을 클릭하면, 다른 사이즈에 대응한 이미지를 등록할 수 있습니다. 등록하지 않으면, 6.9 또는 6.5에 등록된 이미지로 노출됩니다.'}
            </div>
            <div className="text-lg ml-4">
              등록 가능한 사이즈 종류 및 상세 px 사이즈는
              <Link className="text-gray-500" href="https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/" target="_blank"> 여기</Link>
              에서 확인하실 수 있습니다.
            </div>
          </div>

          <h4 className="text-xl font-bold mt-4">
            {'2) 등록 갯수'}
          </h4>
          <div className="text-lg font-bold">
            최소 3개 이상 ~ 최대 10개
          </div>

          <h4 className="text-xl font-bold mt-4">
            {'3) 파일 형식'}
          </h4>
          <div className="text-lg">
            jpg, png를 지원합니다.
          </div>
          <div className="text-lg">
            단, 알파채널(투명도)은 지원하지 않습니다. 화면에 투명도가 적용된 요소가 있다면 알파채널을 지원하는 png 대신 jpg로 출력하는 것이 좋아요.
          </div>

          <h4 className="text-xl font-bold mt-4">
            {'4) 구성 규정'}
          </h4>
          <div className="text-lg">
            앱 기능을 소개하는 문구, 우리 앱의 정체성을 더 잘 표현해줄 수 있는 배경이나 꾸밈요소를 넣을 수 있어요. 단, 아래 사항은 꼭 지켜주세요.
          </div>
          <Image src="/images/guide_appstore_2.png" alt="Appstore 스크린샷 규정" width={1080} height={1080} className="my-8 w-3/4 self-center" />

          <ul className="text-lg list-disc flex flex-col gap-3 ml-6">
            <li>
              앱의 화면이 들어가 있나요?
              <ul className="text-lg ml-4 flex flex-col gap-1" style={{ listStyleType: 'circle' }}>
                <li>
                  앱을 캡처한 원본 이미지는 반드시 포함되어 있어야 합니다.
                </li>
                <li>
                  앱 화면에 들어가는 요소들을 편집해서 넣는 것은 안 됩니다! (예: 게임앱의 경우 게임 아이템과 게임 캐릭터를 따로 편집해서 만든 이미지는 불가, 온전한 스크린샷이 포함되어야 함)
                </li>
              </ul>
            </li>
            <li>
              앱의 기능을 소개하고 있나요?
              <ul className="text-lg ml-4" style={{ listStyleType: 'circle' }}>
                <li>
                  어떤 앱인지, 어떤 기능이 있는지 소개하는 내용 위주로 간결하게 구성해야 합니다.
                </li>
              </ul>
            </li>
            <li>
              저작권을 침해하고 있지는 않나요?
              <ul className="text-lg ml-4" style={{ listStyleType: 'circle' }}>
                <li>
                  스크린샷에 포함된 이미지가 저작권을 침해할 경우 반려될 수 있어요.
                </li>
              </ul>
            </li>
          </ul>

          <h4 className="text-xl font-bold mt-4">
            {'5) 앱스토어 가이드라인'}
          </h4>
          <div className="text-lg">
            아무리 스크린샷을 잘 만들어도 앱의 구동이 앱스토어 가이드라인을 침해하면 반려됩니다. 심사 제출 전 가이드라인 체크리스트를 꼭 확인해보세요.
          </div>
          <div className="text-lg">
            가이드라인
            <Link className="text-gray-500" href="https://developer.apple.com/app-store/review/guidelines/#design" target="_blank"> 링크</Link>
          </div>

          <h3 className="text-2xl font-bold mt-8">
            {'2. 안드로이드폰의 경우, <Google Play Store>'}
          </h3>

          <h4 className="text-xl font-bold mt-4">
            {'1) 크기 규정'}
          </h4>
          <div className="text-lg">
            구글 플레이 스토어에는 <b>휴대전화, 7인치 태블릿, 10인치 태블릿 스크린샷</b>을 필수로 등록해야 합니다. 각각 대응되는 화면을 캡처해서 넣어도 좋지만, <b>16:9로 비율이 모두 동일하기에 같은 이미지로 넣어도 괜찮아요.</b>
          </div>
          <div>
            <ul className="text-lg list-disc ml-6">
              <li>
                320px ~ 3,840px 사이
              </li>
              <li>
                가로세로 비율 16:9 또는 9:16
              </li>
              <li>
                최대 8MB
              </li>
            </ul>

            <h4 className="text-lg font-bold mt-4">
              ※ 미디어 그래픽 이미지
            </h4>
            <ul className="text-lg list-disc ml-6 mt-2">
              <li className="text-lg">
                사이즈 : 1024px x 500px
              </li>
              <li className="text-lg">
                스크린샷 이미지 외에 필수 등록항목인데요, 이 이미지는 앱 프로모션 동영상 URL을 등록했을 때 동영상 재생 전 썸네일로 활용됩니다. 앱 프로모션 동영상 URL을 등록하지 않았다면 노출되지 않아요.
              </li>
            </ul>

          </div>




          <h4 className="text-xl font-bold mt-4">
            {'2) 등록 갯수'}
          </h4>
          <div className="text-lg font-bold">
            최소 2개 이상 ~ 최대 8개
          </div>

          <h4 className="text-xl font-bold mt-4">
            {'3) 파일 형식'}
          </h4>
          <div className="text-lg">
            jpg, (투명하지 않은)png를 지원합니다.
          </div>
          <div className="text-lg">
            단, 알파채널(투명도)은 지원하지 않습니다. 화면에 투명도가 적용된 요소가 있다면 알파채널을 지원하는 png 대신 jpg로 출력하는 것이 좋아요.
          </div>
          <div className="text-lg">
            자세한 내용은 Google의 안내 가이드
            <Link className="text-gray-500" href="https://support.google.com/googleplay/android-developer/answer/9866151?sjid=115775985713934835-AP#zippy=%2C스크린샷" target="_blank">  링크</Link>
            를 확인해주세요.
          </div>

          <div className="w-full flex flex-col gap-1 border border-gray-300 p-8 rounded mt-12 mb-8 text-lg">
            어떠신가요? 사이즈 규정도 헷갈리고, 꾸며서 넣으려니 다룰 수 있는 그래픽 프로그램도 없고 디자인에 자신도 없다면 막막하죠😢 그럴 땐 샷토스터를 이용해보세요! 스크린샷 한 장만 넣으면 디자이너가 미리 만들어 둔 템플릿으로 디자인 완성! 크기별로 출력까지 한 번에 만들 수 있어요!!
          </div>

          <div className="button-wrap flex flex-col items-center mb-12">
            <Link href="/"
              className="start-button rounded-full py-3 px-16 bg-black text-white text-xl font-bold disabled:bg-neutral-400 hover:no-underline hover:text-white">
              샷토스터 시작하기
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}