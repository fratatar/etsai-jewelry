export default function FAQ() {
  return (
    <div className="bg-gray-900 text-white p-6 mt-10 rounded-lg shadow-lg text-sm">
      <h2 className="text-xl font-bold mb-4">❓ Frequently Asked Questions (FAQ)</h2>

      <div className="mb-4">
        <p className="font-semibold">What is EtsAI?</p>
        <p className="text-gray-300">EtsAI is an AI-powered tool designed to generate optimized Etsy listings — including titles, descriptions, tags, and more — tailored for digital product sellers.</p>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Which product types are supported?</p>
        <p className="text-gray-300">Currently, EtsAI focuses on digital products like 3D printables (STL files). More categories will be added soon.</p>
      </div>

      <div className="mb-4">
        <p className="font-semibold">How do I access EtsAI?</p>
        <p className="text-gray-300">You must purchase a plan from our Etsy shop. Use your Receipt ID, first name, and last name to log in.</p>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Can I switch categories?</p>
        <p className="text-gray-300">No. You can only generate content for the category you purchased. Contact support to upgrade or switch.</p>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Can I regenerate the same content?</p>
        <p className="text-gray-300">Yes. Each section has a "Regenerate" button to get alternate AI outputs for the same input.</p>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Does my purchase allow multiple users?</p>
        <p className="text-gray-300">No. One purchase = one user access. Repeated access from other devices may result in restrictions.</p>
      </div>

      <div className="mb-4">
        <p className="font-semibold">I forgot my password. What should I do?</p>
        <p className="text-gray-300">Please contact us via Etsy with your purchase info. We will manually assist you.</p>
      </div>

      <div className="mb-4">
        <p className="font-semibold">How are updates announced?</p>
        <p className="text-gray-300">Follow our Etsy shop or Twitter for announcements on new features and supported categories.</p>
      </div>
    </div>
  )
}
