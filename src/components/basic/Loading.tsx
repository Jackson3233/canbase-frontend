import Image from "next/image";

export default function Loading() {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
            <div className="animate-bounce">
                <Image
                    className="p-2 rounded-full bg-white shadow-lg"
                    src="/assets/images/logo.svg"
                    width={75}
                    height={75}
                    alt="logo"
                />
            </div>
      </div>
    );
  }