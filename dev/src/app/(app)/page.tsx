import Link from "next/link";

const Page = () => {
  return (
    <article className={["container"].filter(Boolean).join(" ")}>
      <h1>
        Payload 3.0 <span className="rainbow">BETA</span>!
      </h1>
      <p>
        This BETA is rapidly evolving, you can report any bugs against{" "}
        <a
          href="https://github.com/payloadcms/payload-3.0-demo/issues"
          target="_blank"
        >
          the repo
        </a>{" "}
        or in the{" "}
        <a
          href="https://discord.com/channels/967097582721572934/1215659716538273832"
          target="_blank"
        >
          dedicated channel in Discord
        </a>
        .
      </p>

      <p>
        <strong>
          Payload is running at <Link href="/admin">/admin</Link> This is to test the package Auth0-Payload
        </strong>
      </p>

      <p>
        <Link href="/my-route" target="_blank">
          /my-route
        </Link>{" "}
        contains an example of a custom route running the Local API.
      </p>

      <p>You can use the Local API in your server components like this:</p>
      <pre>
        <code>
          {`import { getPayload } from 'payload'
import configPromise from "@payload-config";
const payload = await getPayload({ config: configPromise })

const data = await payload.find({
  collection: 'posts',
})`}
        </code>
      </pre>
    </article>
  );
};

export default Page;
