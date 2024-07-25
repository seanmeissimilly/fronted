import { Typography } from "@material-tailwind/react";

export function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-gray-200 p-4">
      <div className="flex justify-between">
        <Typography color="blue-gray" className="text-left font-normal">
          © 2024 Alinfo
        </Typography>
        <ul className="flex gap-x-8">
          <li>
            <Typography
              as="a"
              href="/contact"
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              Contacto
            </Typography>
          </li>
        </ul>
      </div>
    </footer>
  );
}
