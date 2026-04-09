import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getModuleBySlug, modules } from "~/data/modules";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.module) return [{ title: "Module Not Found — UX/UI Workshop" }];
  return [
    { title: `${data.module.title} — UX/UI Workshop` },
    { name: "description", content: data.module.description },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  if (!slug) throw new Response("Not Found", { status: 404 });

  const module = getModuleBySlug(slug);
  if (!module) throw new Response("Module Not Found", { status: 404 });

  const currentIndex = modules.findIndex((m) => m.slug === slug);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  return { module, prevModule, nextModule };
}

export default function ModulePage() {
  const { module, prevModule, nextModule } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col min-h-[calc(100vh-var(--header-height))]">
      <div className="flex-1">
        <ModulePlaceholder module={module} />
      </div>
      <ModuleNav prevModule={prevModule} nextModule={nextModule} />
    </div>
  );
}

function ModulePlaceholder({ module }: { module: { number: string; title: string; description: string } }) {
  return (
    <div className="flex items-center justify-center min-h-100 p-12">
      <div className="max-w-120 text-center">
        <div className="w-14 h-14 rounded-2xl bg-(--accent-dim) border border-(--accent-border) flex items-center justify-center text-(--accent-text) mx-auto mb-6">
          <BookOpen size={24} />
        </div>
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 bg-(--accent-dim) border border-(--accent-border) rounded-full py-1 px-3.5 font-mono text-[11px] font-semibold text-(--accent) tracking-[1.5px] uppercase mb-6 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-(--accent) before:shadow-[0_0_6px_var(--accent)] before:shrink-0">Module {module.number}</span>
        </div>
        <h2 className="text-[22px] font-extrabold text-(--text-primary) mt-0 mb-4 tracking-tight">
          {module.title}
        </h2>
        <p className="text-[15px] text-(--text-secondary) leading-[1.65] mt-0 mb-8">
          {module.description}
        </p>
        <div className="p-4 bg-(--bg-elevated) border border-(--bg-hover) rounded-xl text-[13px] text-(--text-tertiary) leading-[1.55]">
          Content coming soon.
        </div>
      </div>
    </div>
  );
}

export function ModuleNav({
  prevModule,
  nextModule,
}: {
  prevModule: { slug: string; title: string } | null;
  nextModule: { slug: string; title: string } | null;
}) {
  return (
    <div className="bg-(--bg-surface) border-t border-(--bg-hover) py-4 px-8 flex justify-between items-center">
      {prevModule ? (
        <Link
          to={`/modules/${prevModule.slug}`}
          className="flex items-center gap-2 no-underline text-(--text-secondary) text-[13px] font-medium py-2 px-3.5 rounded-lg bg-(--bg-elevated) border border-(--bg-hover) transition-colors duration-150 hover:text-(--text-primary) hover:bg-(--bg-hover)"
        >
          <ArrowLeft size={13} />
          <div>
            <div className="text-[10px] text-(--text-ghost) font-mono tracking-[0.06em] uppercase">Previous</div>
            <div>{prevModule.title}</div>
          </div>
        </Link>
      ) : <div />}
      {nextModule ? (
        <Link
          to={`/modules/${nextModule.slug}`}
          className="flex items-center gap-2 no-underline text-(--text-secondary) text-[13px] font-medium py-2 px-3.5 rounded-lg bg-(--bg-elevated) border border-(--bg-hover) transition-colors duration-150 hover:text-(--text-primary) hover:bg-(--bg-hover)"
        >
          <div className="text-right">
            <div className="text-[10px] text-(--text-ghost) font-mono tracking-[0.06em] uppercase">Next</div>
            <div>{nextModule.title}</div>
          </div>
          <ArrowRight size={13} />
        </Link>
      ) : <div />}
    </div>
  );
}
