import Head from "next/head";
import Link from "next/link";
import { getPage } from "../../lib/lib";
import { join } from "path";
import Meta from "../../components/Meta";
import Container from "../../components/Container";
import SingleColumn from "../../components/SingleColumn";
import ErrorPage from "../404";
import Section from "../../components/Section";
import ob from "urbit-ob";
import Markdown from "../../components/Markdown";
import Sigil from "../../components/Sigil";
import GatewayHeader from "../../components/gateway/GatewayHeader";
import Gateway404 from "../../components/gateway/Gateway404";
import MetadataBlock from "../../components/gateway/MetadataBlock";
import MetadataLink from "../../components/gateway/MetadataLink";
import Description from "../../components/gateway/Description";
import axios from "axios";

const IdPage = ({ data, markdown, network, params }) => {
  const { id } = params;
  if (!ob.isValidPatp(id) || id.length > 14) {
    return <Gateway404 type="ID" />;
  }

  const image = `https://urbit-id-og-cards-kappa.vercel.app/${deSig(id)}.png`;

  // Parent ID, grabbed from network or fallback to the default sponsor for that node
  const parent = network ? network.sponsor["urbit-id"] : ob.sein(id);
  // Galaxy name above that parent
  const galaxy =
    ob.clan(id) === "planet"
      ? network?.sponsor?.sponsor?.["urbit-id"] || ob.sein(parent)
      : null;
  // Galaxies shouldn't show parents, so store it as boolean here for reference.
  const isGalaxy = ob.clan(id) === "galaxy";

  const sigil = (
    <div className="rounded-xl overflow-hidden">
      <Sigil patp={id} size={100} />
    </div>
  );

  return (
    <Container>
      <Head>
        <title>{id} • Urbit ID • urbit.org</title>
        <link rel="icon" type="image/png" href="/images/favicon.ico" />
        <meta
          name="twitter:card"
          content="summary_large_image"
          key="twitter-card"
        />
        <meta
          name="og:title"
          content={`${id} • Urbit ID • urbit.org`}
          key="title"
        />
        <meta
          name="og:description"
          content="View more about this Urbit ID on urbit.org."
          key="description"
        />
        <meta property="twitter:image" content={image} key="image" />
      </Head>
      <SingleColumn>
        <Section className="space-y-12 w-full" narrow>
          <GatewayHeader
            title={id}
            image={data?.image || false}
            sigil={sigil}
            item="Urbit ID"
          />
          <div className="flex flex-wrap md:flex-nowrap justify-between">
            <MetadataBlock
              title="ID Type"
              content={
                ob.clan(id).slice(0, 1).toUpperCase() + ob.clan(id).slice(1)
              }
            />
            <MetadataBlock
              title="Status"
              content={network ? "Spawned/Owned" : "Unspawned"}
            />
            {!isGalaxy && (
              <MetadataLink
                title="Parent"
                href={`/id/${parent}`}
                content={parent}
              />
            )}
            {galaxy && (
              <MetadataLink
                title="Galaxy"
                href={`/id/${galaxy}`}
                content={galaxy}
              />
            )}
          </div>
          <Description
            description={data.description}
            fallback="An Urbit ID."
            markdown={markdown}
          />
          <a
            className="flex items-center"
            target="_blank"
            href={`https://network.urbit.org/${id}`}
          >
            <div className="flex items-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.56 6.39999C11.9487 6.40124 9.49503 7.65251 7.95999 9.76639C6.42623 11.8789 5.99624 14.6 6.80373 17.0838C7.61122 19.5676 9.55874 21.5139 12.0425 22.3213C14.5274 23.1275 17.2476 22.6963 19.3599 21.1613L23.4236 25.225C23.9236 25.7262 24.7348 25.7262 25.2348 25.225C25.7348 24.725 25.7348 23.9149 25.2348 23.415L21.1712 19.3513V19.35C22.3586 17.7188 22.8974 15.7049 22.6862 13.6988C22.4749 11.6926 21.5274 9.83516 20.0262 8.48764C18.5249 7.1389 16.5775 6.39513 14.5599 6.40015L14.56 6.39999ZM14.56 20.16C13.075 20.16 11.65 19.57 10.6 18.52C9.55 17.47 8.95999 16.045 8.95999 14.56C8.95999 13.075 9.55 11.65 10.6 10.6C11.65 9.55001 13.075 8.95999 14.56 8.95999C16.045 8.95999 17.47 9.55001 18.52 10.6C19.57 11.65 20.16 13.075 20.16 14.56C20.1587 16.045 19.5675 17.4675 18.5175 18.5174C17.4675 19.5674 16.045 20.1587 14.5601 20.1599L14.56 20.16Z"
                  fill="#80D8B8"
                />
              </svg>
              <p className="text-green-400 font-semibold">
                View on Network Explorer
              </p>
            </div>
          </a>
          <hr className="text-wall-200" />
          <div className="flex flex-col space-y-6">
            <h3>
              Urbit is a clean-slate, peer-to-peer operating system and network.
            </h3>
            <div className="flex flex-col space-y-4">
              <p className="text-md font-semibold text-wall-400">
                Learn how get your own Urbit ID.
              </p>
              {/* TODO: Joining groups guide. */}
              <button className="button-lg max-w-xs bg-green-400 text-white">
                Get an Urbit ID
              </button>
            </div>
          </div>
          <hr className="text-wall-200" />
          <div className="flex flex-col space-y-1">
            <p>Have an Urbit ID?</p>
            {/* TODO Submission guide. */}
            <p className="font-semibold text-green-400">
              Claim and customize your Urbit.org page
            </p>
          </div>
          <Link href="/">
            <a className="text-xl pt-8 block font-semibold">Urbit.org</a>
          </Link>
        </Section>
      </SingleColumn>
    </Container>
  );
};

function deSig(string) {
  return string.startsWith("~") ? string.substring(1) : string;
}

export const getServerSideProps = async ({ params, res }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=604800"
  );

  let { data, content } = getPage(
    join(process.cwd(), "content/id/", params.id.slice(1))
  ) || { data: {}, content: "" };

  if (!data.ship && ob.isValidPatp(params.id)) {
    data = { ship: params.id, description: "An Urbit ID." };
  }

  let network = await axios
    .get(
      `https://mt2aga2c5l.execute-api.us-east-2.amazonaws.com/get-node?urbit-id=${
        ob.isValidPatp(params.id) ? params.id : "~zod"
      }`
    )
    .then((res) => res.data);

  const markdown = await Markdown({ post: { content: content } }, true);

  return {
    props: {
      data,
      markdown,
      network,
      params,
    },
  };
};

export default IdPage;