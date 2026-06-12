import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/liability-waiver")({
  head: () => ({
    meta: [
      { title: "Liability Waiver — Grandma's Herbals" },
      { name: "description", content: "Client Wellness Disclosure, Liability Waiver, and Informed Consent Agreement." },
    ],
  }),
  component: LiabilityWaiverPage,
});

function LiabilityWaiverPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-to-b from-stone-50 via-white to-olive-50/40 py-16 sm:py-24">
        <div className="container mx-auto px-4 relative max-w-4xl">
          <div className="bg-white border border-stone-200/80 shadow-[0_20px_70px_rgba(73,88,52,0.06)] rounded-[2rem] p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-olive-100 text-olive-700 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-olive-500">Legal Agreement</p>
                <h1 className="text-3xl sm:text-4xl font-cormorant font-bold text-olive-900 mt-1">LIABILITY WAIVER &amp; BOTANICAL WELLNESS DISCLOSURE</h1>
              </div>
            </div>
            
            <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-6 text-sm sm:text-base">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-stone-600 text-xs sm:text-sm italic">
                This Client Wellness Disclosure, Liability Waiver &amp; Informed Consent Agreement (&ldquo;Agreement&rdquo;) is entered into between Grandma&rsquo;s Herbals (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) and the undersigned client (&ldquo;Client,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;).
              </div>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">WITNESSETH</h2>
              <p>
                <strong>WHEREAS</strong>, Grandma&rsquo;s Herbals (&ldquo;Company&rdquo;) is a Georgia-based botanical wellness company engaged in the development, preparation, marketing, distribution, and sale of herbal, botanical, and naturally inspired wellness products intended solely for general wellness, educational, lifestyle, and traditional botanical purposes;
              </p>
              <p>
                <strong>WHEREAS</strong>, the Company has invested substantial time, effort, creativity, resources, independent development, botanical sourcing efforts, wellness system structuring, formulation methodology, educational content creation, operational strategy, branding development, supplier cultivation, product conceptualization, and proprietary business development into the creation of its botanical wellness systems, customized herbal blends, ingredient structures, wellness methodologies, operational systems, educational materials, and related intellectual property;
              </p>
              <p>
                <strong>WHEREAS</strong>, the Company may provide educational wellness consultations, customized botanical wellness formulations, herbal product recommendations, wellness discussions, informational materials, and naturally inspired wellness products to voluntarily requesting individuals located within the State of Georgia and, where legally permissible, individuals located in other jurisdictions;
              </p>
              <p>
                <strong>WHEREAS</strong>, the Client voluntarily desires to purchase, request, use, participate in consultations regarding, receive information concerning, or otherwise engage with botanical wellness products, customized herbal blends, educational wellness services, or informational materials offered by Grandma&rsquo;s Herbals;
              </p>
              <p>
                <strong>NOW, THEREFORE</strong>, in consideration of the mutual covenants, acknowledgments, disclosures, and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:
              </p>
              <p className="font-semibold text-stone-800">
                By purchasing, requesting, using, or participating in any consultation, recommendation, evaluation, product purchase, custom formulation, or wellness service offered by Grandma&rsquo;s Herbals, the Client acknowledges and agrees to the following terms:
              </p>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">1. Scope of Products &amp; Wellness Services</h2>
              <p>
                The Client acknowledges and understands that Grandma&rsquo;s Herbals operates as a botanical wellness company offering herbal and naturally derived wellness products intended solely for general wellness, educational, lifestyle, and traditional botanical purposes. The Company&rsquo;s products are created using combinations of herbs, roots, leaves, flowers, fruits, mushrooms, seeds, bark, minerals, and other naturally inspired ingredients that have historically appeared in various traditional wellness practices and botanical traditions.
              </p>
              <p>
                The Client further understands that statements, discussions, educational materials, ingredient references, wellness information, historical botanical discussions, or traditional herbal references associated with Grandma&rsquo;s Herbals products have not necessarily been evaluated by the United States Food and Drug Administration (&ldquo;FDA&rdquo;). No product sold, discussed, promoted, recommended, or distributed by Grandma&rsquo;s Herbals is intended to diagnose, treat, cure, mitigate, or prevent any disease, illness, disorder, or medical condition. Grandma&rsquo;s Herbals does not manufacture or market pharmaceutical drugs, prescription medications, compounded pharmaceuticals, or medical treatment products. All products should be understood and treated as herbal wellness products derived from naturally sourced botanical ingredients.
              </p>
              <p>
                The Client acknowledges that herbal wellness products may affect individuals differently based upon genetics, allergies, lifestyle, medication use, sensitivities, dietary factors, and individual body chemistry. The Client further understands that botanical products are not represented as substitutes for professional medical treatment, physician supervision, emergency care, pharmaceutical treatment, or licensed healthcare services. Clients are strongly encouraged to consult with a licensed physician, pharmacist, or qualified healthcare provider before using any botanical product, especially if pregnant, nursing, taking medications, preparing for surgery, managing a medical condition, or under medical supervision.
              </p>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">2. Research &amp; Traditional Use Disclosure</h2>
              <p>
                The Client acknowledges and understands that certain herbs, mushrooms, botanical ingredients, plant extracts, roots, leaves, flowers, seeds, fruits, and other naturally derived substances used within Grandma&rsquo;s Herbals products may have been discussed within publicly available botanical literature, historical herbal references, ethnobotanical records, wellness publications, traditional cultural practices, independent ingredient discussions, or limited scientific research involving individual plant ingredients.
              </p>
              <p>
                The Client further understands that any publicly available information, independent ingredient discussion, historical use reference, or traditional botanical discussion involving individual herbal ingredients does not constitute medical proof, guaranteed effectiveness, clinical validation, therapeutic representation, or FDA approval regarding any specific Grandma&rsquo;s Herbals product, blend, preparation, formulation, or customized botanical compound. Grandma&rsquo;s Herbals has not conducted proprietary clinical trials, pharmaceutical testing, medical research studies, or FDA-regulated investigations involving its individualized botanical blends, customized wellness formulations, or proprietary ingredient combinations. Available information involving individual herbs or plant ingredients may not apply to the specific ingredient combinations, preparation methods, concentrations, delivery systems, or wellness formulations created by Grandma&rsquo;s Herbals.
              </p>
              <p>
                The Client further understands that scientific understanding involving herbs, mushrooms, botanical ingredients, and naturally derived compounds continues to evolve and may remain incomplete, limited, debated, or subject to differing interpretations. Any educational information provided by Grandma&rsquo;s Herbals is presented solely for general wellness education, historical botanical reference, and informational purposes and should not be interpreted as medical advice, treatment recommendation, prescription guidance, or therapeutic representation.
              </p>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">3. Custom Formulation Disclosure</h2>
              <p>
                The Client acknowledges that Grandma&rsquo;s Herbals may prepare customized botanical wellness blends based upon information voluntarily provided by the Client regarding personal wellness interests, lifestyle preferences, supplement routines, ingredient sensitivities, allergies, hydration preferences, relaxation goals, general wellness objectives, traditional herbal interests, and overall lifestyle considerations.
              </p>
              <p>
                The Client understands that all customized formulations created by Grandma&rsquo;s Herbals are intended solely as individualized herbal wellness products and are not prescriptions, compounded pharmaceutical medications, treatment plans, physician-directed protocols, medical nutrition therapy, pharmaceutical substitutes, or regulated healthcare services. Customized botanical formulations are developed solely for general wellness support and educational botanical purposes.
              </p>
              <p>
                The Client further acknowledges that individualized wellness formulations may affect each person differently due to factors including genetics, body chemistry, allergies, sensitivities, diet, medication use, underlying health conditions, hydration levels, environmental exposures, and individual tolerance to botanical ingredients. Grandma&rsquo;s Herbals makes no guarantee regarding how any person may respond to a particular herbal blend, wellness preparation, or customized botanical compound. The Client voluntarily assumes all responsibility for monitoring personal reactions, discontinuing use if concerns arise, seeking physician approval where appropriate, and obtaining emergency medical attention if a severe reaction or medical concern occurs.
              </p>
              <p>
                The Client further understands that any consultation, intake discussion, wellness questionnaire, or educational communication conducted by Grandma&rsquo;s Herbals is intended solely to support general wellness education and botanical product customization and does not create a physician-patient, pharmacist-patient, therapist-patient, or healthcare-provider relationship.
              </p>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">4. Assumption of Risk &amp; Liability Release</h2>
              <p>
                The Client knowingly, voluntarily, and expressly acknowledges that the use of herbs, mushrooms, botanical ingredients, natural wellness compounds, plant extracts, essential oils, teas, tinctures, powders, topical products, vitality beverages, capsules, wellness infusions, or other naturally derived products may involve inherent risks, including both known and unknown risks, foreseeable and unforeseeable risks, allergic reactions, ingredient sensitivities, medication interactions, digestive discomfort, skin irritation, respiratory reactions, dizziness, nausea, headaches, sedation, stimulation, or individualized adverse responses.
              </p>
              <p>
                The Client understands that botanical products may affect individuals differently and that reactions may vary significantly depending upon personal health history, allergies, prescription medications, supplement use, environmental factors, underlying medical conditions, hydration, genetics, and overall body chemistry. By voluntarily purchasing, consuming, applying, possessing, requesting, or using any Grandma&rsquo;s Herbals product, the Client knowingly assumes full responsibility for all risks associated with the use or misuse of botanical wellness products.
              </p>
              <p>
                To the fullest extent permitted under applicable law, the Client releases, waives, discharges, and agrees to hold harmless Grandma&rsquo;s Herbals, including its owners, officers, members, employees, contractors, affiliates, suppliers, consultants, formulators, representatives, successors, and assigns from and against any claims, liabilities, injuries, losses, damages, expenses, or causes of action arising from or relating to the voluntary use of any botanical product, customized formulation, wellness consultation, educational material, ingredient sensitivity, allergic response, undisclosed medical condition, medication interaction, or reliance upon wellness-related information provided by the Company. Nothing contained herein shall waive liability for gross negligence, intentional misconduct, fraud, or unlawful conduct where such waiver is prohibited under applicable law.
              </p>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">5. Interstate Commerce &amp; Multi-State Acknowledgment</h2>
              <p>
                The Client acknowledges and understands that Grandma&rsquo;s Herbals is a Georgia-based botanical wellness company that may provide educational wellness consultations, botanical wellness products, customized herbal formulations, and naturally derived wellness preparations to voluntarily requesting customers located in multiple states where such activity is legally permissible. The Client further acknowledges that all purchases, consultations, communications, requests, and transactions involving Grandma&rsquo;s Herbals are voluntarily initiated by the Client for general wellness purposes only.
              </p>
              <p>
                The Client understands that Grandma&rsquo;s Herbals does not represent that any product is approved, registered, or specifically regulated within every jurisdiction and that laws involving herbs, supplements, botanical products, labeling, consumer use, and wellness products may vary by state, locality, or jurisdiction. By purchasing or requesting products from Grandma&rsquo;s Herbals, the Client accepts responsibility for understanding and complying with any local laws, restrictions, or regulations applicable within the Client&rsquo;s jurisdiction.
              </p>
              <p>
                The Client further agrees that Grandma&rsquo;s Herbals operates exclusively from the State of Georgia and that any dispute arising from the purchase or use of products shall be governed by the laws of the State of Georgia unless otherwise prohibited by applicable law. The Client additionally acknowledges that no physician-patient relationship, practitioner-patient relationship, telehealth relationship, pharmaceutical relationship, or regulated healthcare-provider relationship is created through interstate communications, consultations, referrals, educational discussions, or product transactions involving Grandma&rsquo;s Herbals.
              </p>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">6. Proprietary Information, Confidentiality &amp; Non-Circumvention</h2>
              <p>
                The Client acknowledges and understands that Grandma&rsquo;s Herbals has invested substantial time, effort, creativity, independent development, botanical sourcing efforts, wellness system structuring, formulation methodology, educational content creation, operational strategy, branding development, supplier cultivation, product conceptualization, and proprietary business development into the creation and operation of its botanical wellness products, customized herbal blends, wellness systems, ingredient combinations, consultation structures, educational materials, marketing methods, and related business operations.
              </p>
              <p>
                The Client further acknowledges that certain information disclosed through consultations, educational discussions, practitioner communications, product access, ingredient structures, sourcing discussions, wellness methodologies, customized botanical formulation processes, operational systems, supplier relationships, branding strategies, and business communications may constitute proprietary, confidential, commercially valuable, or trade-secret information belonging exclusively to Grandma&rsquo;s Herbals.
              </p>
              <p>
                Accordingly, the Client agrees not to knowingly or intentionally:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>commercially replicate proprietary botanical formulations or customized wellness blends for direct competitive purposes;</li>
                <li>reverse engineer product structures for commercial duplication;</li>
                <li>disclose confidential business information to competitors or unauthorized third parties;</li>
                <li>intentionally circumvent supplier, practitioner, referral, manufacturing, consulting, or business relationships introduced through Grandma&rsquo;s Herbals;</li>
                <li>misappropriate confidential operational systems, educational frameworks, branding concepts, or formulation methodologies for unfair commercial advantage;</li>
                <li>represent Grandma&rsquo;s Herbals&rsquo; proprietary concepts, ingredient structures, or wellness systems as their own.</li>
              </ul>
              <p>
                The Client further agrees that any confidential, proprietary, commercially sensitive, or trade-secret information obtained directly or indirectly through interactions with Grandma&rsquo;s Herbals—including but not limited to customized formulation structures, botanical ingredient combinations, sourcing relationships, supplier information, operational systems, consultation methodologies, wellness frameworks, preparation methods, branding concepts, business strategies, manufacturing processes, educational systems, pricing structures, client-development systems, and proprietary business practices—shall be maintained in strict confidence and shall not be copied, disclosed, reproduced, distributed, reverse engineered, commercially exploited, or used for the purpose of developing, marketing, assisting, funding, manufacturing, consulting for, or operating a competing botanical, herbal, wellness, supplement, or related business utilizing substantially similar proprietary concepts or confidential business methods derived from Grandma&rsquo;s Herbals.
              </p>
              <p>
                The Client further agrees not to intentionally circumvent Grandma&rsquo;s Herbals for the purpose of directly soliciting or exploiting supplier relationships, manufacturing relationships, referral relationships, practitioner relationships, proprietary sourcing channels, or confidential operational systems introduced or developed by the Company for unfair commercial advantage or competitive interference.
              </p>
              <p>
                Nothing contained within this Agreement shall prohibit lawful independent competition, independently developed products or services created without the use of Grandma&rsquo;s Herbals&rsquo; confidential information, legally protected professional activity, lawful educational discussion, or any activity protected under applicable state or federal law. This provision is narrowly intended solely to protect legitimate proprietary interests, confidential business information, commercially sensitive operational systems, trade-secret materials, customized wellness methodologies, supplier relationships, formulation concepts, and intellectual property belonging exclusively to Grandma&rsquo;s Herbals.
              </p>
              <p>
                The Client further acknowledges and agrees that unauthorized disclosure, misuse, replication, circumvention, commercial exploitation, or competitive use of Grandma&rsquo;s Herbals&rsquo; confidential or proprietary information may result in immediate and irreparable harm to the Company for which monetary damages alone may be inadequate. Accordingly, Grandma&rsquo;s Herbals shall be entitled to pursue all remedies available under applicable law, including injunctive relief, equitable relief, damages, attorney&rsquo;s fees where permitted, and any other lawful remedies necessary to protect its proprietary business interests and trade-secret materials.
              </p>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">7. Product Storage &amp; Safe Use</h2>
              <p>
                The Client agrees to:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>use products responsibly;</li>
                <li>follow provided instructions;</li>
                <li>discontinue use if adverse reactions occur;</li>
                <li>store products appropriately;</li>
                <li>keep products away from children.</li>
              </ul>
              <p>
                Grandma&rsquo;s Herbals is not responsible for product misuse, improper storage, or unauthorized redistribution after delivery.
              </p>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">8. Dispute Resolution &amp; Arbitration</h2>
              <p>
                Any dispute arising from this Agreement, product purchases, consultations, or use of Grandma&rsquo;s Herbals products shall be resolved through binding arbitration under the laws of the State of Georgia, unless otherwise prohibited by law. The Client waives the right to jury trial to the fullest extent permitted by law.
              </p>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">9. Governing Law &amp; Severability</h2>
              <p>
                This Agreement shall be governed by and interpreted under the laws of the State of Georgia without regard to conflict-of-law principles. If any provision of this Agreement is deemed invalid or unenforceable, the remaining provisions shall remain in full force and effect.
              </p>

              <h2 className="text-xl font-bold font-cormorant text-olive-900 mt-8 border-b pb-2">10. Acknowledgment &amp; Informed Consent</h2>
              <p>
                By checking the consent box during membership registration or checkout, you acknowledge that you:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>have carefully read this Agreement;</li>
                <li>understand the nature of botanical wellness products;</li>
                <li>voluntarily assume all risks;</li>
                <li>understand that products are herbal wellness products and not medical treatments;</li>
                <li>understand no outcomes are guaranteed;</li>
                <li>have had the opportunity to consult a licensed healthcare provider;</li>
                <li>knowingly and voluntarily agree to all terms contained herein.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
